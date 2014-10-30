Auphonic Mobile Installation Instructions
=========================================

Here are instructions on how to install and run the Auphonic Mobile App.


Installation for Development in Browser
---------------------------------------

* Install [Cordova (PhoneGap)](http://phonegap.com/):
 * `(sudo) npm install -g cordova`
 * `(sudo) npm install -g plugman`
 * Note that for iOS a fork of Cordova is currently being used: https://github.com/cpojer/cordova-ios

* Install NodeJS and npm:
 * `brew install node npm` on OS X using [Homebrew](http://mxcl.github.com/homebrew/)
 * `apt-get install npm` on Debian-based systems
 * *Note*: on Linux NodeJS is sometimes called `nodejs` and not `node` (create a symlink `sudo ln -s /usr/bin/nodejs /usr/bin/node` as described [here](https://stackoverflow.com/questions/18130164/nodejs-vs-node-on-ubuntu-12-04) )

* run `npm install` in the root folder (this folder)

* Create an App at https://auphonic.com/api/apps/ and insert your API Keys in `JavaScript/APIKeys.js.rename`, copy the file to `APIKeys.js`

* Run `Scripts/watch --once` to compile all resources.
 * Run it without the `--once` flag to watch for changes during development.


Run in Browser
--------------

* Adjust parameters in App/index.html:
 * set `this.__PLATFORM` to `'ios'` or `'android'`
 * set `LOCAL_IP` to your local IP address

* Start a local webserver:
 * Run `(sudo) python -m SimpleHTTPServer 80` in the root folder to server files
 * Run `Scripts/watch` to listen for changes

* Use Google Chrome and open `localhost/App/`:
 * Be sure to enable touch events in Web Inspector (see: Web Inspector Settings)


Installation for iOS
--------------------

* Use the Xcode project in `iOS/` to run the App on the iPhone
* In Cordova, run `lib/ios/bin/update_cordova_subproject` to update Cordova references in the iOS project.
* If you need to update the Cordova plugins, run `./install-cordova-plugins` in the `Scripts` path.
* *Note:* When developing locally in a browser the relative path of the project in `App/index.html` needs to be adjusted and the local server needs to be added to `iOS/Auphonic/config.xml` and `Android/res/xml/config.xml`.


Installation for Android
------------------------

* Android: Download and Install the Android SDK
 * Set a symlink from App/ to Android/assets: `ln -s App Android/assets/`
* (optional) Download and install [Roboto](http://developer.android.com/design/style/typography.html)
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