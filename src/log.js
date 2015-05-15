let log = console.log.bind(console);

console.log = (...args) => {
  if (navigator.notification) {
    // navigator.notification.beep();
    // navigator.notification.alert(JSON.stringify(args));
  }

  let {
    cordova, device
  } = window;

  if (cordova && device) {
    if (device.platform == 'Android') {
      // alert(cordova.file.externalApplicationStorageDirectory);
      return log(args.join(' '));
    }
  }

  log(...args);
};

window.onerror = (msg, url, line, column, err) => {
  let text = `${msg} (${url} [${line}:${column}])`;

  console.log(text, err);

  let app = window.app;

  if (app && app.game) {
    app.game.errors = app.game.errors || [];
    app.game.errors.push(text);
  }
};

export default log;
