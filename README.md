Auphonic Mobile App
===================

This is the source for the Auphonic Mobile Web Application targeted at iOS and Android. It is built using web technologies combined with Cordova (Phonegap).
This application is being developed by [@cpojer](http://cpojer.net) as bachelor's thesis at the [Graz University of Technology](http://tugraz.at/) for Auphonic.

Install
-------

* Install [Cordova (PhoneGap)](http://phonegap.com/)
* Install NodeJS and npm (`brew install node npm` on OS X using [Homebrew](http://mxcl.github.com/homebrew/))
* `npm install` in the root folder
* Create an App at https://auphonic.com/api/apps/ and insert your API Keys in `JavaScript/APIKeys.js`
* Use `Scripts/compile` to compile JavaScript and `Scripts/stylus` to compile Stylus to CSS

Run
---

* Use the Xcode project in `iOS/` to run the App on the iPhone
* Use Google Chrome and open `App/` on a local server.
 * Be sure to enable touch events in Web Inspector (see: Web Inspector Settings)
 * *Note:* If developing locally in a browser adjust the relative path of the project in `App/index.html
* The Android version is not functional yet

PhoneGap Upgrade Notes for iOS
------------------------------

  // Add
  location = 'gap://ready';
  return;

  // Before
  if (!gapBridge) {
      createGapBridge();
  }
  gapBridge.src = "gap://ready";

Logo
----

Gaussian Blur (129.5 for Splash, 247.5 for Icon) on a centered white circle. Set the layer to 48 % opacity.
