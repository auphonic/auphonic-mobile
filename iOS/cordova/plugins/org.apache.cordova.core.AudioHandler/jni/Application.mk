# Build both ARMv5TE and ARMv7-A machine code.
APP_ABI := armeabi armeabi-v7a

APP_MODULES = auphonic-recorder auphonic-sndfile
APP_OPTIM = release

AUPHONIC_NATIVE_FLAGS = \
    -Ijni/sndfile/deps/libogg/include \
    -Ijni/sndfile/deps/libvorbis/include \
    -Ijni/sndfile/src

APP_CFLAGS += $(AUPHONIC_NATIVE_FLAGS)
APP_CXXFLAGS += $(AUPHONIC_NATIVE_FLAGS)
