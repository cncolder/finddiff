/*
Cordova
  webview shell.
 */

class App {
  // Application Constructor
  constructor() {
    this.bindEvents();

    this.previousBackbuttonTimestamp = 0;
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
    document.addEventListener('backbutton',
      this.onBackKeyDown.bind(this), false);
  }

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady() {
    console.log('[Cordova] ready');
  }

  onPause() {
    console.log('[Cordova] pause');
  }

  onResume() {
    console.log('[Cordova] resume');
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
