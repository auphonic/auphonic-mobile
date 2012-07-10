Auphonic Mobile App
===================


Logo
----

Gaussian Blur (129.5 for Splash, 247.5 for Icon) on a centered white circle. Set the layer to 48 % opacity.


Phonegap Upgrade Notes
----------------------

    // Add
    location = 'gap://ready';
    return;

    // Before
    if (!gapBridge) {
        createGapBridge();
    }
    gapBridge.src = "gap://ready";
