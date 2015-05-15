/*
Cordova
  webview shell.
 */

import i18n from './i18n';

class App {
  // Application Constructor
  constructor() {
    this.bindEvents();

    this.previousBackbuttonTimestamp = 0;
  }

  get i18n() {
    return i18n;
  }

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents() {
    document.addEventListener('deviceready',
      this.onDeviceReady.bind(this), false);
    document.addEventListener('pause',
      this.onPause.bind(this), false);
    document.addEventListener('resume',
      this.onResume.bind(this), false);
    document.addEventListener('offline',
      this.onOffline.bind(this), false);
    document.addEventListener('online',
      this.onOnline.bind(this), false);
    document.addEventListener('backbutton',
      this.onBackKeyDown.bind(this), false);
  }

  // check new version. if there is, return apk download link.
  checkVersion() {
    let t = this.i18n.t;
    let appVersion = cordova.plugins.version.getAppVersion();
    let updateServer = 'http://192.168.1.109:3000';
    let updateUrl = updateServer + '/update.json?version=' + appVersion;

    console.log('[App] current version', appVersion);

    if (navigator.connection.type == Connection.WIFI) {
      let platform = device.platform.toLowerCase();

      if (platform == 'android') {
        let url = updateUrl + `&platform=${platform}`;

        fetch(url)
          .then(res => res.json())
          .then(json => {
            let {
              lastest, version, download
            } = json;

            if (lastest) {
              console.log('[App] my version is updated');
            } else {
              console.log('[App] new version', version, download);

              navigator.notification.confirm(
                // jscs: disable maximumLineLength
                t `Your app running currently ${appVersion} was outdated. Please download and install the newer version ${version}.`,
                // jscs: enable maximumLineLength
                buttonIndex => {
                  if (buttonIndex == 1) {
                    open(updateServer + download, '_system');
                  }
                },
                t `There is a new version`, [t `Update`, t `Later`, ]
              );
            }
          })
          .catch(ex => console.log('[App] check version error', ex));
      }
    }
  }

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady() {
    console.log('[Cordova] ready');

    // hook all page loads to go through the InAppBrowser
    // https://github.com/apache/cordova-plugin-inappbrowser
    if (cordova.InAppBrowser) {
      window.open = cordova.InAppBrowser.open;
    }

    this.i18n.init();
    this.checkVersion();
  }

  onPause() {
    console.log('[Cordova] pause');
  }

  onResume() {
    console.log('[Cordova] resume');
  }

  onOffline() {
    console.log('[Cordova] offline');
  }

  onOnline() {
    console.log('[Cordova] online');
  }

  onBackKeyDown() {
    console.log('[Cordova] backbutton');

    let now = Date.now();
    let gap = now - this.previousBackbuttonTimestamp;

    this.previousBackbuttonTimestamp = now;

    if (gap < 300) {
      navigator.app.exitApp();
    }
  }
}

export default App;
