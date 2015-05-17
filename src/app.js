/*
Cordova
  webview shell.
 */

import I18n from './i18n';

class App {
  // Application Constructor
  constructor() {
    this.bindEvents();

    // Phaser game.input.doubleTapRate is 300ms.
    this.doubleTapRate = 300;
  }

  // check new version. if there is, return apk download link.
  checkVersion() {
    let t = this.t;
    let appVersion = cordova.plugins.version.getAppVersion();
    let updateServer = 'http://192.168.1.109:3000';
    let updateUrl = `${updateServer}/update.json?version=${appVersion}`;

    console.log('[App] current version', appVersion);

    if (navigator.connection.type == Connection.WIFI) {
      let platform = device.platform.toLowerCase();

      if (platform == 'android') {
        let url = `${updateUrl}&platform=${platform}`;

        fetch(url)
          .then(res => res.json())
          .then(json => {
            let {
              latest, version, download
            } = json;

            if (latest) {
              console.log('[App] my version is updated');
            } else {
              console.log('[App] new version', version, download);

              navigator.notification.confirm(
                // jscs: disable maximumLineLength
                t `Your app running currently ${appVersion} was outdated. Please download and install the newer version ${version}.`,
                // jscs: enable maximumLineLength
                buttonIndex => {
                  if (buttonIndex == 1) {
                    cordova.plugins.FileOpener.openFile(
                      updateServer + download,
                      data => {
                        console.log('[Opener]', data.message);
                      },
                      err => {
                        console.log('[Opener] error', err.message);
                      },
                      true);
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

  // Bind Event Listeners
  //
  // Bind any events that are required on startup.
  bindEvents() {
    document.addEventListener('deviceready',
      this.onDeviceReady.bind(this), false
    );

    document.addEventListener('pause',
      this.onPause.bind(this), false
    );
    document.addEventListener('resume',
      this.onResume.bind(this), false
    );

    document.addEventListener('offline',
      this.onOffline.bind(this), false
    );
    document.addEventListener('online',
      this.onOnline.bind(this), false
    );

    document.addEventListener('backbutton',
      this.onBackKeyDown.bind(this), false
    );
  }

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady() {
    console.log('[Cordova] ready');

    this.t = (new I18n()).t;

    // this.polyfill();
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
    let gap = now - (this.previousBackbuttonTimestamp || 0);

    if (gap < this.doubleTapRate) {
      navigator.app.exitApp();
    } else {
      this.previousBackbuttonTimestamp = now;
    }
  }
}

export default App;
