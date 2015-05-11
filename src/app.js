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
    document.addEventListener('deviceready', this.onDeviceReady, false);
  }

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady() {
    this.receivedEvent('deviceready');
  }

  receivedEvent(id) {
    log('Received Event:', id);
  }
}

export default App;
