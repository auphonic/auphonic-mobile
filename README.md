Auphonic Mobile App
===================

This is the source for the Auphonic Mobile Web Application targeted at iOS and Android. It is built using web technologies combined with Cordova (Phonegap).
This application is being developed by [@cpojer](http://cpojer.net) as bachelor's thesis at the [Graz University of Technology](http://tugraz.at/) for Auphonic.

Install
-------

* Install [Cordova (PhoneGap)](http://phonegap.com/). Note that for iOS a fork of Cordova is currently being used: https://github.com/cpojer/incubator-cordova-ios
* Install NodeJS and npm (`brew install node npm` on OS X using [Homebrew](http://mxcl.github.com/homebrew/))
* `npm install` in the root folder
* Create an App at https://auphonic.com/api/apps/ and insert your API Keys in `JavaScript/APIKeys.js.rename`, rename the file to `APIKeys.js`
* Changes to `Templates/` can be applied by running `Scripts/compileTemplates`.
* Use `Scripts/compile` to compile JavaScript, `Scripts/stylus` to compile Stylus to CSS and `Scripts/stylus-client` to compile the Stylus to CSS that is bundled with the App

Run
---

* Use the Xcode project in `iOS/` to run the App on the iPhone
* Use Google Chrome and open `App/` on a local server.
 * Be sure to enable touch events in Web Inspector (see: Web Inspector Settings)
 * *Note:* When developing locally in a browser the relative path of the project in `App/index.html` needs to be adjusted and the local server needs to be added to Cordova.plist in XCode.
* Android
 * Download and Install Eclipse
 * Download and Install the Android SDK
 * Create an Android Project from existing sources and point it to `Android/`
 * Copy all files from `App/` except `cordova.js` to `Android/assets/App`
 * Launch the Emulator from within Eclipse (Run As > Android Application)
 * Shoot yourself

Logo
----

Gaussian Blur (129.5 for Splash, 247.5 for Icon) on a centered white circle. Set the layer to 48 % opacity.
