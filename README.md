Auphonic Mobile App [![App Store](https://auphonic.com/static/images/app-store.png)](https://itunes.apple.com/app/auphonic/id575204274?mt=8)
===================

This is the source for the Auphonic Mobile Web Application targeted at iOS and Android. It is built using web technologies combined with Cordova (Phonegap).
This application was initially developed by [@cpojer](http://cpojer.net) as bachelor thesis at the [Graz University of Technology](http://tugraz.at/) for Auphonic.

[![Flattr Button](http://api.flattr.com/button/button-static-50x60.png "Flattr This!")](https://flattr.com/thing/1035105/Auphonic-Mobile-App "Auphonic-Mobile-App")

![Screenshot 1](http://dl.dropbox.com/u/1928164/App1.jpg)
![Screenshot 2](http://dl.dropbox.com/u/1928164/App2.jpg)

Install
-------

* Install [Cordova (PhoneGap)](http://phonegap.com/). Note that for iOS a fork of Cordova is currently being used: https://github.com/cpojer/cordova-ios
* Install NodeJS and npm (`brew install node npm` on OS X using [Homebrew](http://mxcl.github.com/homebrew/), `apt-get install npm` on Debian-based systems)
* *Note*: on Linux NodeJS is sometimes called `nodejs` and not `node`
* `npm install` in the root folder
* Create an App at https://auphonic.com/api/apps/ and insert your API Keys in `JavaScript/APIKeys.js.rename`, copy the file to `APIKeys.js`
* Run `Scripts/watch --once` to compile all resources. Run the script without the `--once` flag to watch for changes during development.
* In Cordova, run `lib/ios/bin/update_cordova_subproject` to update Cordova references in the iOS project.
* Android: Download and Install the Android SDK
 * Set a symlink from App/ to Android/assets: `ln -s App Android/assets/`
* (optional) Download and install [Roboto](http://developer.android.com/design/style/typography.html)
* If you need to update the Cordova plugins, run `./install-cordova-plugins` in the `Scripts` path.

Run
---

* Use the Xcode project in `iOS/` to run the App on the iPhone
* Use Google Chrome and open `App/` on a local server.
 * Be sure to enable touch events in Web Inspector (see: Web Inspector Settings)
 * *Note:* When developing locally in a browser the relative path of the project in `App/index.html` needs to be adjusted and the local server needs to be added to `iOS/Auphonic/config.xml` and `Android/res/xml/config.xml`.
* Android
 * Ensure that the `Android/` folder links to the correct version of Cordova Android
 * Copy all files from `App/` except `cordova.js` to `Android/assets/App`
  * Update __PLATFORM to 'android' on top of index.html
 * Run `Android/cordova/run`
 * Shoot yourself

Deployment
----------

* Run `Scripts/compile` to generate a compressed file with all server resources ready for deployment.
* Remove "REMOVE WHEN DEPLOYING" block from index.html
* Update both config.xml files (in iOS and Android folders) and remove all but auphonic.com from the `<access origin=…>` blocks
* Ensure that index.html says `this.__PLATFORM = 'ios'` for iOS and `this.__PLATFORM = 'android'` for Android
* Build and ship with the appropriate toolset for either iOS or Android
* Rethink this list and automate all the above steps.

Logo
----

Gaussian Blur (129.5 for Splash, 247.5 for Icon) on a centered white circle. Set the layer to 48 % opacity.
