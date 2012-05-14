Auphonic Mobile App
===================

Sprites
-------

HSL: Saturation 0, Lightning +30

Logo
----

Gaussian Blur (129.5 for Splash, 247.5 for Icon) on a centered white circle. Set the layer to 48 % opacity.


Phonegap Upgrade Notes
----------------------

    if (cordova.commandQueue.length == 1 && !cordova.commandQueueFlushing) {
        /*if (!gapBridge) {
            createGapBridge();
        }
        gapBridge.src = "gap://ready";*/
        location = "gap://ready";
    }
