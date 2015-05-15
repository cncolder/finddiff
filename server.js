require('debug').log = console.log.bind(console);

var semver = require('semver');
var koa = require('koa');
var app = koa();

app.use(require('koa-logger')());

var stat = require('koa-static');

app.use(stat('./www', {
  index: 'index.html',
}));

app.use(stat('./platforms/android/build/outputs/apk'));

app.use(function*(next) {
  var version = this.query.version;

  if (this.path == '/update.json' && version) {
    this.assert(semver.valid(version), 400, 'version invalid');

    if (semver.lt(version, '1.1.0')) {
      this.body = {
        version: '1.1.0',
        download: '/android-release.apk',
      };
    } else {
      this.body = {
        version: '1.1.0',
        latest: true,
      };
    }
  } else {
    yield next;
  }
});

var http = require('http');
var port = parseInt(process.env.PORT || 3000, 10);
var server = http.createServer(app.callback());

server.listen(port, function() {
  var address = server.address();
  console.log('App listening at http://%s:%s', address.address, address.port);
});
