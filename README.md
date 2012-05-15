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

    if (navigator.userAgent.toLowerCase().match(/(ip(ad|od|hone))/)) {
        location = 'gap://ready';
        return;
    }

    if (!gapBridge) {
        createGapBridge();
    }
    gapBridge.src = "gap://ready";
