/*
Cordova
  webview shell.
 */

import fetch from 'whatwg-fetch';
import I18n from './i18n';

class App {
  // Application Constructor
  constructor() {
    this.bindEvents();
  }

  // check new version. if there is, return apk download link.
  checkVersion() {
    let appVersion = cordova.compileTime.version;

    console.log('[App] current version', appVersion);

    if (navigator.connection.type == Connection.WIFI) {
      let updateServer = 'http://haoduo.vitarn.com';
      let updateUrl = `${updateServer}/update.json?version=${appVersion}`;
      let platform = device.platform.toLowerCase();
      let t = this.t;

      if (platform == 'android') {
        let url = `${updateUrl}&platform=${platform}`;

        fetch(url)
          .then(res => res.json())
          .then(json => {
            let {
              latest, version, download
            } = json;

            if (latest) {
              console.log('[App][Android] my version is updated');
            } else {
              console.log('[App][Android] new version', version, download);

              navigator.notification.confirm(
                // jscs: disable maximumLineLength
                t `Your app running currently ${appVersion} was outdated. Please download and install the newer version ${version}.`,
                // jscs: enable maximumLineLength
                buttonIndex => {
                  if (buttonIndex == 1) {
                    cordova.plugins.FileOpener.openFile(
                      updateServer + download,
                      data => {
                        console.log('[Opener][Android]', data.message);
                      },
                      err => {
                        console.log('[Opener][Android] error', err.message);
                      },
                      true);
                  }
                },
                t `There is a new version`, [t `Update`, t `Later`, ]
              );
            }
          })
          .catch(ex => console.log('[App][Android] check version error', ex));
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

    // fix ios background crash gpus_ReturnNotPermittedKillClient
    // Background Apps May Not Execute Commands on the Graphics Hardware https://developer.apple.com/library/ios/documentation/3DDrawing/Conceptual/OpenGLES_ProgrammingGuide/ImplementingaMultitasking-awareOpenGLESApplication/ImplementingaMultitasking-awareOpenGLESApplication.html#//apple_ref/doc/uid/TP40008793-CH5-SW1
    if (window.game && game.device.iOS && game.renderType == Phaser.WEBGL) {
      console.log('[App][iOS] turn on lockRender to prevent background crash.');

      this.gameLockRenderBeforePause = game.lockRender;
      game.lockRender = true;
    }
  }

  onResume() {
    console.log('[Cordova] resume');

    if (window.game && game.device.iOS && game.renderType == Phaser.WEBGL) {
      game.lockRender = this.gameLockRenderBeforePause;
    }
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

    if (gap < game.input.doubleTapRate) {
      navigator.app.exitApp();
    } else {
      this.previousBackbuttonTimestamp = now;
    }
  }
}

export default App;
