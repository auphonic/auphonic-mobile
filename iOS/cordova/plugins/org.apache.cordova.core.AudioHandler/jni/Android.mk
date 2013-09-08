LOCAL_PATH := $(call my-dir)


# Build libsndfile statically
#
# (based on jni/sndfile/src/Android.mk)

include $(CLEAR_VARS)

OGG_ROOT := sndfile/deps/libogg/include
VORBIS_ROOT := sndfile/deps/libvorbis/include

LOCAL_CFLAGS := -DHAVE_EXTERNAL_LIBS
LOCAL_C_INCLUDES := $(OGG_ROOT) $(VORBIS_ROOT)

LOCAL_MODULE := auphonic-sndfile

# libogg and libvorbis source files
OGG_SRC := sndfile/deps/libogg/src
OGG_SRC_FILES := $(OGG_SRC)/bitwise.c $(OGG_SRC)/framing.c
V_SRC := sndfile/deps/libvorbis/src
VORBIS_SRC_FILES := $(V_SRC)/analysis.c $(V_SRC)/floor0.c $(V_SRC)/lsp.c \
    $(V_SRC)/res0.c $(V_SRC)/vorbisfile.c $(V_SRC)/bitrate.c $(V_SRC)/floor1.c \
    $(V_SRC)/mapping0.c $(V_SRC)/sharedbook.c $(V_SRC)/window.c $(V_SRC)/block.c \
    $(V_SRC)/info.c $(V_SRC)/mdct.c $(V_SRC)/smallft.c $(V_SRC)/codebook.c \
    $(V_SRC)/lookup.c $(V_SRC)/psy.c $(V_SRC)/synthesis.c $(V_SRC)/envelope.c \
    $(V_SRC)/lpc.c  $(V_SRC)/registry.c $(V_SRC)/vorbisenc.c

SF_SRC := sndfile/src
LOCAL_SRC_FILES := $(SF_SRC)/mat5.c $(SF_SRC)/windows.c \
    $(SF_SRC)/G72x/g723_24.c $(SF_SRC)/G72x/g72x.c $(SF_SRC)/G72x/g723_40.c \
    $(SF_SRC)/G72x/g721.c $(SF_SRC)/G72x/g723_16.c $(SF_SRC)/float32.c \
    $(SF_SRC)/chanmap.c $(SF_SRC)/test_endswap.c $(SF_SRC)/rf64.c \
    $(SF_SRC)/sndfile.c $(SF_SRC)/htk.c $(SF_SRC)/dither.c \
    $(SF_SRC)/test_log_printf.c $(SF_SRC)/txw.c $(SF_SRC)/ms_adpcm.c \
    $(SF_SRC)/ima_adpcm.c $(SF_SRC)/flac.c $(SF_SRC)/aiff.c $(SF_SRC)/wav.c \
    $(SF_SRC)/macbinary3.c $(SF_SRC)/mat4.c $(SF_SRC)/pcm.c $(SF_SRC)/caf.c \
    $(SF_SRC)/audio_detect.c $(SF_SRC)/id3.c $(SF_SRC)/alaw.c $(SF_SRC)/macos.c \
    $(SF_SRC)/file_io.c $(SF_SRC)/broadcast.c $(SF_SRC)/double64.c \
    $(SF_SRC)/raw.c $(SF_SRC)/test_broadcast_var.c $(SF_SRC)/g72x.c \
    $(SF_SRC)/command.c $(SF_SRC)/chunk.c $(SF_SRC)/avr.c $(SF_SRC)/sd2.c \
    $(SF_SRC)/voc.c $(SF_SRC)/test_audio_detect.c $(SF_SRC)/mpc2k.c \
    $(SF_SRC)/gsm610.c $(SF_SRC)/dwd.c $(SF_SRC)/interleave.c $(SF_SRC)/common.c \
    $(SF_SRC)/test_strncpy_crlf.c $(SF_SRC)/sds.c $(SF_SRC)/pvf.c $(SF_SRC)/paf.c \
    $(SF_SRC)/au.c $(SF_SRC)/test_float.c $(SF_SRC)/vox_adpcm.c $(SF_SRC)/ulaw.c \
    $(SF_SRC)/strings.c $(SF_SRC)/svx.c $(SF_SRC)/test_conversions.c \
    $(SF_SRC)/rx2.c $(SF_SRC)/nist.c $(SF_SRC)/GSM610/code.c \
    $(SF_SRC)/GSM610/gsm_destroy.c $(SF_SRC)/GSM610/gsm_decode.c \
    $(SF_SRC)/GSM610/short_term.c $(SF_SRC)/GSM610/gsm_create.c \
    $(SF_SRC)/GSM610/decode.c $(SF_SRC)/GSM610/gsm_option.c \
    $(SF_SRC)/GSM610/long_term.c $(SF_SRC)/GSM610/table.c $(SF_SRC)/GSM610/rpe.c \
    $(SF_SRC)/GSM610/preprocess.c $(SF_SRC)/GSM610/gsm_encode.c \
    $(SF_SRC)/GSM610/lpc.c $(SF_SRC)/GSM610/add.c $(SF_SRC)/dwvw.c \
    $(SF_SRC)/wav_w64.c $(SF_SRC)/wve.c $(SF_SRC)/ogg.c $(SF_SRC)/ogg_vorbis.c \
    $(SF_SRC)/w64.c $(SF_SRC)/test_file_io.c $(SF_SRC)/ircam.c $(SF_SRC)/xi.c \
    $(SF_SRC)/ima_oki_adpcm.c \
    $(OGG_SRC_FILES) $(VORBIS_SRC_FILES)

include $(BUILD_STATIC_LIBRARY)


# Lastly build the JNI wrapper and link both other libs against it
#
include $(CLEAR_VARS)

LOCAL_MODULE    := auphonic-recorder
LOCAL_SRC_FILES := \
	jni/SndfileEncoder.cpp \
	jni/util.cpp
LOCAL_LDLIBS := -llog

LOCAL_STATIC_LIBRARIES := auphonic-sndfile

include $(BUILD_SHARED_LIBRARY)
