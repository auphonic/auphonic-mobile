Auphonic Mobile App
===================

Sprites
-------

HSL: Saturation 0, Lightning +30


Phonegap Upgrade Notes
----------------------

    if (cordova.commandQueue.length == 1 && !cordova.commandQueueFlushing) {
        /*if (!gapBridge) {
            createGapBridge();
        }
        gapBridge.src = "gap://ready";*/
        location = "gap://ready";
    }
