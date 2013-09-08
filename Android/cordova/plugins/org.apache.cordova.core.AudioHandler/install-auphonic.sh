#!/bin/sh
#
# cordova and auphonic recorder install script for auphonic-mobile

AUPHONIC_MOBILE_DIR=$(cat auphonic.path)

echo "\nBuilding native code…\n"

# build C code
ndk/ndk-build

echo "\nInstalling new C code…\n"

# copy native libraries
cp libs/armeabi/libauphonic-recorder.so $AUPHONIC_MOBILE_DIR/Android/libs/armeabi
cp libs/armeabi-v7a/libauphonic-recorder.so $AUPHONIC_MOBILE_DIR/Android/libs/armeabi-v7a

echo "\nDone!\n"

