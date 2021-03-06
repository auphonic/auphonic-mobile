/**
 * Class to encode raw audio data with libsndfile.
 * 2013, by Auphonic
 *
 * Author: Auphonic, Georg Holzmann <grh _at_ auphonic _dot_ com>
 *
 * Based on AudioBoo android recorder.
 *
 * Original comment:
 *
 * This file is part of AudioBoo, an android program for audio blogging.
 * Copyright (C) 2011 Audioboo Ltd. All rights reserved.
 *
 * Author: Jens Finkhaeuser <jens@finkhaeuser.de>
 *
 * $Id$
 **/

// Define __STDINT_LIMITS to get INT8_MAX and INT16_MAX.
#define __STDINT_LIMITS 1
#include <stdint.h>
#include <assert.h>
#include <string.h>
#include <alloca.h>
#include <limits.h>
#include <pthread.h>
#include <unistd.h>
#include <math.h>

#include "sndfile.h"
#include "util.h"

#include <jni.h>


// datatype for internal audio sample buffers (32bit float)
#define sample_t float


namespace aj = audioboo::jni;

namespace {

/*****************************************************************************
 * Constants
 **/
static char const * const SndfileEncoder_classname   = "com.auphonic.jni.SndfileEncoder";
static char const * const SndfileEncoder_mObject     = "mObject";

static char const * const IllegalArgumentException_classname  = "java.lang.IllegalArgumentException";

static char const * const LTAG                          = "SndfileEncoder/native";



/*****************************************************************************
 * Native SndfileEncoder representation
 *
 * SndfileEncoder uses a writer thread to write its internal buffer. The
 * implementation is deliberately simple, and writing functions like this:
 *
 * 1. There's a thread on which Java makes JNI calls to write some data, the
 *    JNI thread.
 *    There's also a thread on which data is written to disk via sndfile, the
 *    writer thread.
 * 2. Data is passed from the JNI thread to the writer thread via a locked
 *    singly linked list of buffers; the JNI thread appends buffers to the
 *    list, and once appended, relinquishes ownership which passes to the
 *    writer thread. The writer thread processes the list in a FIFO fashion;
 *    we'll call the list the write FIFO.
 * 3. Upon being called by Java to write data, the JNI thread writes the
 *    data to an internal buffer.
 *    If that buffer becomes full,
 *    a) it's appended to the write FIFO, and ownership is relinquished.
 *    b) a new buffer is allocated for subsequent write calls
 *    c) the writer thread is woken.
 **/

class SndfileEncoder
{
public:
  // Write FIFO
  struct write_fifo_t
  {
    write_fifo_t(sample_t * buf, int fillsize)
      : m_next(NULL)
      , m_buffer(buf) // Taking ownership here.
      , m_buffer_fill_size(fillsize)
    {
    }


    ~write_fifo_t()
    {
      // We have ownership!
      delete [] m_buffer;
      delete m_next;
    }


    write_fifo_t * last() volatile
    {
      volatile write_fifo_t * last = this;
      while (last->m_next) {
        last = last->m_next;
      }
      return (write_fifo_t *) last;
    }


    write_fifo_t *  m_next;
    sample_t *      m_buffer;
    int             m_buffer_fill_size;
  };

  // Thread trampoline arguments
  struct trampoline
  {
    typedef void * (SndfileEncoder::* func_t)(void * args);

    SndfileEncoder * m_encoder;
    func_t              m_func;
    void *              m_args;

    trampoline(SndfileEncoder * encoder, func_t func, void * args)
      : m_encoder(encoder)
      , m_func(func)
      , m_args(args)
    {
    }
  };


  /**
   * Takes ownership of the outfile.
   **/
  SndfileEncoder(char * outfile, int sample_rate, int channels,
      int bits_per_sample, int recording_type, double recording_quality)
    : m_outfile(outfile)
    , m_sample_rate(sample_rate)
    , m_channels(channels)
    , m_bits_per_sample(bits_per_sample)
    , m_recording_type(recording_type)
    , m_recording_quality(recording_quality)
    , m_sfoutfile(NULL)
    , m_max_amplitude(0)
    , m_average_sum(0)
    , m_average_count(0)
    , m_write_buffer(NULL)
    , m_write_buffer_size(0)
    , m_write_buffer_offset(0)
    , m_fifo(NULL)
    , m_kill_writer(false)
  {
  }


  /**
   * There are no exceptions here, so we need to "construct" outside the ctor.
   * Returns NULL on success, else an error message
   **/
  char const * const init()
  {
    if (!m_outfile) {
      return "No file name given!";
    }

    // set parameters for libsndfile
    memset(&m_sfinfo, 0, sizeof(SF_INFO));
    m_sfinfo.samplerate = m_sample_rate;
    m_sfinfo.channels = m_channels;

    // set audio file format
    // TODO: this is hardcoded to vorbis ATM!
    if (m_recording_type == 1) { // WAV
      if (m_bits_per_sample == 8) m_sfinfo.format = SF_FORMAT_WAV | SF_FORMAT_PCM_S8;  // 8bit signed WAV
      else m_sfinfo.format = SF_FORMAT_WAV | SF_FORMAT_PCM_16;  // 16bit WAV
    } else { // OGG
      m_sfinfo.format = SF_FORMAT_OGG | SF_FORMAT_VORBIS;

    }

    // NOTE about vorbis:
    // - see below for bitrate settings!

    // NOTE about libsndfile and flac:
    // - flac output format did not work
    // - I guess we have to add the libflac to the build system?
    // - or we have to set some additional flags, don't know ...

    // check sndfile format
    if(!sf_format_check(&m_sfinfo)) {
        return "Invalid Audio Fileformat!";
    }

    m_sfoutfile = sf_open(m_outfile, SFM_WRITE, &m_sfinfo);
    if (!m_sfoutfile) {
        sf_close(m_sfoutfile);
        return "Could not create audio outputfile with libsndfile!";
    }

    // set vorbis encoding quality (bitrate):
    // - quality should be between 0 and 1
    // - quality 0.4 is the default value
    // - no idea how this quality values corresponds to oggenc qualities/bitrates
    // - some experiments (all mono):
    //   0.8 = 140k
    //   0.85 = 150k
    //   0.9 = 160k
    //   -> the bitrate seems to be fixed, so I don't know if this is VBR !?
    if (m_recording_type == 0) {
      double quality = m_recording_quality;
      sf_command(m_sfoutfile, SFC_SET_VBR_ENCODING_QUALITY, &quality, sizeof (quality)) ;
    }

    // Allocate write buffer. Based on observations noted down in issue #106, we'll
    // choose this to be 32k in size. Actual allocation happens lazily.
    m_write_buffer_size = 32768;

    // The write FIFO gets created lazily. But we'll initialize the mutex for it
    // here.
    int err = pthread_mutex_init(&m_fifo_mutex, NULL);
    if (err) {
      return "Could not initialize FIFO mutex!";
    }

    // Similarly, create the condition variable for the writer thread.
    err = pthread_cond_init(&m_writer_condition, NULL);
    if (err) {
      return "Could not initialize writer thread condition!";
    }

    // Start thread!
    err = pthread_create(&m_writer, NULL, &SndfileEncoder::trampoline_func,
        new trampoline(this, &SndfileEncoder::writer_thread, NULL));
    if (err) {
      return "Could not start writer thread!";
    }

    return NULL;
  }



  /**
   * Destroys encoder instance, releases outfile
   **/
  ~SndfileEncoder()
  {
    // Flush thread.
    flush_to_fifo();

    pthread_mutex_lock(&m_fifo_mutex);
    m_kill_writer = true;
    pthread_mutex_unlock(&m_fifo_mutex);

    pthread_cond_broadcast(&m_writer_condition);

    // Clean up thread related stuff.
    void * retval = NULL;
    pthread_join(m_writer, &retval);
    pthread_cond_destroy(&m_writer_condition);
    pthread_mutex_destroy(&m_fifo_mutex);

    // Clean up libsndfile
    if (m_sfoutfile) {
        sf_close(m_sfoutfile);
        m_sfoutfile = NULL;
    }

    if (m_outfile) {
      free(m_outfile);
      m_outfile = NULL;
    }
  }



  /**
   * Flushes internal buffers to disk.
   **/
  int flush()
  {
    //aj::log(ANDROID_LOG_DEBUG, LTAG, "flush() called.");
    flush_to_fifo();

    // Signal writer to wake up.
    pthread_cond_signal(&m_writer_condition);
  }



  /**
   * Writes bufsize elements from buffer to the stream. Returns the number of
   * bytes actually written.
   **/
  int write(char * buffer, int bufsize)
  {
    // aj::log(ANDROID_LOG_DEBUG, LTAG, "Asked to write buffer of size %d", bufsize);

    // We have 8 or 16 bit pcm in the buffer, but we store it as 32 bit floats
    // NOTE: that's devided by 2 if we have 16bit, because we reinterpret the
    // 8bit char buffer as 16bit signed integers!
    int bufsize32 = bufsize / (m_bits_per_sample / 8);
    // aj::log(ANDROID_LOG_DEBUG, LTAG, "Required size: %d", bufsize32);

    // Protect from overly large buffers on the JNI side.
    if (bufsize32 > m_write_buffer_size) {
      // The only way we can handle this sanely without fragmenting buffers and
      // so forth is to use a separate code path here. In this, we'll flush the
      // current write buffer to the FIFO, and immediately append a new
      // FIFO entry that's as large as bufsize32.
      flush_to_fifo();

      m_write_buffer = new sample_t[bufsize32];
      m_write_buffer_offset = 0;

      int ret = copyBuffer(buffer, bufsize, bufsize32);
      flush_to_fifo();

      // Signal writer to wake up.
      pthread_cond_signal(&m_writer_condition);

      return ret;
    }


    // If the current write buffer cannot hold the amount of data we've
    // got, push it onto the write FIFO and create a new buffer.
    if (m_write_buffer && m_write_buffer_offset + bufsize32 > m_write_buffer_size) {
      aj::log(ANDROID_LOG_DEBUG, LTAG, "JNI buffer is full, pushing to FIFO");
      flush_to_fifo();

      // Signal writer to wake up.
      pthread_cond_signal(&m_writer_condition);
    }

    // If we need to create a new buffer, do so now.
    if (!m_write_buffer) {
      // aj::log(ANDROID_LOG_DEBUG, LTAG, "Need new buffer.");
      m_write_buffer = new sample_t[m_write_buffer_size];
      m_write_buffer_offset = 0;
    }

    // At this point we know that there's a write buffer, and we know that
    // there's enough space in it to write the data we've received.
    return copyBuffer(buffer, bufsize, bufsize32);
  }



  /**
   * Writer thread function.
   **/
  void * writer_thread(void * args)
  {
    // Loop while m_kill_writer is false.
    pthread_mutex_lock(&m_fifo_mutex);
    do {
      //aj::log(ANDROID_LOG_DEBUG, LTAG, "Going to sleep...");
      pthread_cond_wait(&m_writer_condition, &m_fifo_mutex);
      //aj::log(ANDROID_LOG_DEBUG, LTAG, "Wakeup: should I die after this? %s", (m_kill_writer ? "yes" : "no"));

      sf_count_t written = 0;

      // Grab ownership over the current FIFO, and release the lock again.
      write_fifo_t * fifo = (write_fifo_t *) m_fifo;
      while (fifo) {
        m_fifo = NULL;
        pthread_mutex_unlock(&m_fifo_mutex);

        // Now we can take all the time we want to iterate over the FIFO's
        // contents. We just need to make sure to grab the lock again before
        // going into the next iteration of this loop.
        int retry = 0;

        write_fifo_t * current = fifo;
        while (current) {
          // aj::log(ANDROID_LOG_DEBUG, LTAG, "Encoding current entry %p, buffer %p, size %d",
          //    current, current->m_buffer, current->m_buffer_fill_size);

          // Encode with libsndfile
          written = sf_writef_float(m_sfoutfile, current->m_buffer,
                                    current->m_buffer_fill_size);

          if (written == current->m_buffer_fill_size) {
            retry = 0;
          }
          else {
            // We don't really know how much was written, we have to assume it was
            // nothing.
            if (++retry > 3) {
              aj::log(ANDROID_LOG_ERROR, LTAG, "Giving up on writing current FIFO!");
              break;
            }
            else {
              // Sleep a little before retrying.
              aj::log(ANDROID_LOG_ERROR, LTAG, "Writing FIFO entry %p failed; retrying...");
              usleep(5000); // 5msec
            }
            continue;
          }

          current = current->m_next;
        }

        // Once we've written everything, delete the fifo and grab the lock again.
        delete fifo;
        pthread_mutex_lock(&m_fifo_mutex);
        fifo = (write_fifo_t *) m_fifo;
      }

      //aj::log(ANDROID_LOG_DEBUG, LTAG, "End of wakeup, or should I die? %s", (m_kill_writer ? "yes" : "no"));
    } while (!m_kill_writer);

    pthread_mutex_unlock(&m_fifo_mutex);

    //aj::log(ANDROID_LOG_DEBUG, LTAG, "Writer thread dies.");
	for (long i=0;i<50; i++){
		aj::log(ANDROID_LOG_DEBUG, LTAG,".");
		usleep(5000);
	}
    aj::log(ANDROID_LOG_DEBUG, LTAG, "slept.");
    return NULL;
  }



  float getMaxAmplitude()
  {
    float result = m_max_amplitude;
    // aj::log(ANDROID_LOG_DEBUG, LTAG, "Max Amplitude: %f", result);
    m_max_amplitude = 0;
    return result;
  }



  float getAverageAmplitude()
  {
    float result = m_average_sum / m_average_count;
    // aj::log(ANDROID_LOG_DEBUG, LTAG, "Average Amplitude: %f", result);
    m_average_sum = 0;
    m_average_count = 0;
    return result;
  }


private:

  /**
   * Append current write buffer to FIFO, and clear it.
   **/
  inline void flush_to_fifo()
  {
    if (!m_write_buffer) {
      return;
    }

    //aj::log(ANDROID_LOG_DEBUG, LTAG, "Flushing to FIFO.");

    write_fifo_t * next = new write_fifo_t(m_write_buffer, m_write_buffer_offset);
    m_write_buffer = NULL;

    pthread_mutex_lock(&m_fifo_mutex);
    if (m_fifo) {
      write_fifo_t * last = m_fifo->last();
      last->m_next = next;
    }
    else {
      m_fifo = next;
    }
    //aj::log(ANDROID_LOG_DEBUG, LTAG, "FIFO: %p, new entry: %p", m_fifo, next);
    pthread_mutex_unlock(&m_fifo_mutex);
  }



  /**
   * Wrapper around templatized copyBuffer that writes to the current write
   * buffer at the current offset.
   **/
  inline int copyBuffer(char * buffer, int bufsize, int bufsize32)
  {
    sample_t * buf = m_write_buffer + m_write_buffer_offset;

    //aj::log(ANDROID_LOG_DEBUG, LTAG, "Writing at %p[%d] = %p", m_write_buffer, m_write_buffer_offset, buf);
    if (8 == m_bits_per_sample) {
      copyBuffer<int8_t>(buf, buffer, bufsize);
      m_write_buffer_offset += bufsize32;
    }
    else if (16 == m_bits_per_sample) {
      copyBuffer<int16_t>(buf, buffer, bufsize);
      m_write_buffer_offset += bufsize32;
    }
    else {
      // XXX should never happen, just exit.
      return 0;
    }

    return bufsize;
  }



  /**
   * Copies inbuf to outpuf, assuming that inbuf is really a buffer of
   * sized_sampleT.
   * As a side effect, m_max_amplitude, m_average_sum and m_average_count are
   * modified.
   **/
  template <typename sized_sampleT>
  void copyBuffer(sample_t * outbuf, char * inbuf, int inbufsize)
  {
    sized_sampleT * inbuf_sized = reinterpret_cast<sized_sampleT *>(inbuf);
    float amp = 0;

    for (int i = 0 ; i < inbufsize / sizeof(sized_sampleT) ; ++i) {
      sized_sampleT cur = inbuf_sized[i];

      // Convert integer sample to float 32bit sample between -1 and 1
      outbuf[i] = static_cast<sample_t>(cur) / aj::type_traits<sized_sampleT>::MAX;

      // calc absolute amplitude
      amp = fabs(outbuf[i]);

      // Store max absolute amplitude
      if (amp > m_max_amplitude) {
        m_max_amplitude = amp;
      }

      // Sum average
      // NOTE: maybe it's better to calc the RMS value instead of the mean?
      if (!(i % m_channels)) {
        m_average_sum += amp;
        ++m_average_count;
      }
    }
  }


  // Thread trampoline
  static void * trampoline_func(void * args)
  {
    trampoline * tramp = static_cast<trampoline *>(args);
    SndfileEncoder * encoder = tramp->m_encoder;
    trampoline::func_t func = tramp->m_func;

    void * result = (encoder->*func)(tramp->m_args);

    // Ownership tor tramp is passed to us, so we'll delete it here.
    delete tramp;
    return result;
  }



  // Configuration values passed to ctor
  char *  m_outfile;
  int     m_sample_rate;
  int     m_channels;
  int     m_bits_per_sample;
  int     m_recording_type;
  double  m_recording_quality;

  // variables for libsndfile
  SNDFILE *m_sfoutfile;
  SF_INFO m_sfinfo;

  // Max amplitude measured
  float   m_max_amplitude;
  float   m_average_sum;
  int     m_average_count;

  // JNI thread's buffer.
  sample_t *    m_write_buffer;
  int           m_write_buffer_size;
  int           m_write_buffer_offset;

  // Write FIFO
  volatile write_fifo_t * m_fifo;
  pthread_mutex_t         m_fifo_mutex;

  // Writer thread
  pthread_t       m_writer;
  pthread_cond_t  m_writer_condition;
  volatile bool   m_kill_writer;
};




/*****************************************************************************
 * Helper functions
 **/

/**
 * Retrieve SndfileEncoder instance from the passed jobject.
 **/
static SndfileEncoder * get_encoder(JNIEnv * env, jobject obj)
{
  assert(sizeof(jlong) >= sizeof(SndfileEncoder *));

  // Do the JNI dance for getting the mObject field
  jclass cls = env->FindClass(SndfileEncoder_classname);
  jfieldID object_field = env->GetFieldID(cls, SndfileEncoder_mObject, "J");
  jlong encoder_value = env->GetLongField(obj, object_field);

  env->DeleteLocalRef(cls);

  return reinterpret_cast<SndfileEncoder *>(encoder_value);
}


/**
 * Store SndfileEncoder instance in the passed jobject.
 **/
static void set_encoder(JNIEnv * env, jobject obj, SndfileEncoder * encoder)
{
  assert(sizeof(jlong) >= sizeof(SndfileEncoder *));

  // Do the JNI dance for setting the mObject field
  jlong encoder_value = reinterpret_cast<jlong>(encoder);
  jclass cls = env->FindClass(SndfileEncoder_classname);
  jfieldID object_field = env->GetFieldID(cls, SndfileEncoder_mObject, "J");
  env->SetLongField(obj, object_field, encoder_value);
  env->DeleteLocalRef(cls);
}


} // anonymous namespace



/*****************************************************************************
 * JNI Wrappers
 **/

extern "C" {

void
Java_com_auphonic_jni_SndfileEncoder_init(JNIEnv * env, jobject obj,
    jstring outfile, jint sample_rate, jint channels, jint bits_per_sample, jint recording_type, jdouble recording_quality)
{
  assert(sizeof(jlong) >= sizeof(SndfileEncoder *));

  SndfileEncoder * encoder = new SndfileEncoder(
      aj::convert_jstring_path(env, outfile), sample_rate, channels,
      bits_per_sample, recording_type, recording_quality);

  char const * const error = encoder->init();
  if (NULL != error) {
    delete encoder;

    aj::throwByName(env, IllegalArgumentException_classname, error);
    return;
  }

  set_encoder(env, obj, encoder);
}



void
Java_com_auphonic_jni_SndfileEncoder_deinit(JNIEnv * env, jobject obj)
{
  SndfileEncoder * encoder = get_encoder(env, obj);
  delete encoder;
  set_encoder(env, obj, NULL);
}



jint
Java_com_auphonic_jni_SndfileEncoder_write(JNIEnv * env, jobject obj,
    jobject buffer, jint bufsize)
{
  SndfileEncoder * encoder = get_encoder(env, obj);

  if (NULL == encoder) {
    aj::throwByName(env, IllegalArgumentException_classname,
        "Called without a valid encoder instance!");
    return 0;
  }

  if (bufsize > env->GetDirectBufferCapacity(buffer)) {
    aj::throwByName(env, IllegalArgumentException_classname,
        "Asked to read more from a buffer than the buffer's capacity!");
  }

  char * buf = static_cast<char *>(env->GetDirectBufferAddress(buffer));
  return encoder->write(buf, bufsize);
}



void
Java_com_auphonic_jni_SndfileEncoder_flush(JNIEnv * env, jobject obj)
{
  SndfileEncoder * encoder = get_encoder(env, obj);

  if (NULL == encoder) {
    aj::throwByName(env, IllegalArgumentException_classname,
        "Called without a valid encoder instance!");
    return;
  }

  encoder->flush();
}



jfloat
Java_com_auphonic_jni_SndfileEncoder_getMaxAmplitude(JNIEnv * env, jobject obj)
{
  SndfileEncoder * encoder = get_encoder(env, obj);

  if (NULL == encoder) {
    aj::throwByName(env, IllegalArgumentException_classname,
        "Called without a valid encoder instance!");
    return 0;
  }

  return encoder->getMaxAmplitude();
}



jfloat
Java_com_auphonic_jni_SndfileEncoder_getAverageAmplitude(JNIEnv * env, jobject obj)
{
  SndfileEncoder * encoder = get_encoder(env, obj);

  if (NULL == encoder) {
    aj::throwByName(env, IllegalArgumentException_classname,
        "Called without a valid encoder instance!");
    return 0;
  }

  return encoder->getAverageAmplitude();
}


} // extern "C"
