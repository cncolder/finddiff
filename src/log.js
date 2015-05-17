let log = console.log.bind(console);

console.log = (...args) => {
  let {
    cordova, device
  } = window;

  if (cordova && device) {
    if (device.platform == 'Android') {
      return log(args.join(' '));
    }
  }

  log(...args);
};

window.onerror = (msg, url, line, column, err) => {
  let text = `${msg} (${url} [${line}:${column}])`;

  console.log(text, err);
};

export default log;
