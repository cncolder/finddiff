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

  polyfill() {
    // hook dialogs to go through Dialogs
    // https://github.com/apache/cordova-plugin-dialogs
    if (navigator.notification) {
      // alert(message, alertCallback, [title], [buttonName])
      /*  message: Dialog message. (String)
          alertCallback: Callback to invoke when alert dialog is dismissed. (Function)
          title: Dialog title. (String) (Optional, defaults to Alert)
          buttonName: Button name. (String) (Optional, defaults to OK)
      */
      window.alert = navigator.notification.alert;

      // confirm(message, confirmCallback, [title], [buttonLabels])
      /*  message: Dialog message. (String)
          confirmCallback: Callback to invoke with index of button pressed (1, 2, or 3) or when the dialog is dismissed without a button press (0). (Function)
          title: Dialog title. (String) (Optional, defaults to Confirm)
          buttonLabels: Array of strings specifying button labels. (Array) (Optional, defaults to [OK,Cancel])
      */
      window.confirm = navigator.notification.confirm;

      // prompt(message, promptCallback, [title], [buttonLabels], [defaultText])
      /*  message: Dialog message. (String)
          promptCallback: Callback to invoke with index of button pressed (1, 2, or 3) or when the dialog is dismissed without a button press (0). (Function)
          title: Dialog title (String) (Optional, defaults to Prompt)
          buttonLabels: Array of strings specifying button labels (Array) (Optional, defaults to ["OK","Cancel"])
          defaultText: Default textbox input value (String) (Optional, Default: empty string)
      */
      window.prompt = navigator.notification.prompt;

      // non standard beep function
      // beep(times)
      /*  times: The number of times to repeat the beep. (Number)
      */
      window.beep = navigator.notification.beep;
    }

    // hook all page loads to go through InAppBrowser
    // https://github.com/apache/cordova-plugin-inappbrowser
    if (cordova.InAppBrowser) {
      // var ref = open(url, target, options);
      /*  ref: Reference to the InAppBrowser window. (InAppBrowser)
          url: The URL to load (String). Call encodeURI() on this if the URL contains Unicode characters.
          target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
            _self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
            _blank: Opens in the InAppBrowser.
            _system: Opens in the system's web browser.
          options: Options for the InAppBrowser. Optional, defaulting to: location=yes. (String)
      */
      window.open = cordova.InAppBrowser.open;
    }
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

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady() {
    console.log('[Cordova] ready');

    // this.polyfill();
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
