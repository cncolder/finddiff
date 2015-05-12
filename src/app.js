const log = require('debug')('app'); // jshint ignore:line

/*
Cordova
  webview shell.
 */

class App {
  // Application Constructor
  constructor() {
    this.bindEvents();
  }

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents() {
    document.addEventListener('deviceready',
      this.onDeviceReady.bind(this), false);
    document.addEventListener('pause', this.onPause.bind(this), false);
    document.addEventListener('resume', this.onResume.bind(this), false);
  }

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady() {
    log('ready');

    this.receivedEvent('deviceready');
  }

  onPause() {
    log('pause');

    if (this.game) {
      this.game.sound.mute = true;
    }
  }

  onResume() {
    log('resume');

    if (this.game) {
      this.game.sound.mute = false;
    }
  }

  receivedEvent(id) {
    log('Received Event:', id);
  }
}

export default App;
