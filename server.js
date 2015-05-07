require('debug').log = console.log.bind(console);

var koa = require('koa');
var app = koa();

app.use(require('koa-logger')());

app.use(require('koa-static')('./www', {
  index: 'index.html',
}));

var http = require('http');
var port = parseInt(process.env.PORT || 3000, 10);
var server = http.createServer(app.callback());

server.listen(port, function() {
  var address = server.address();
  console.log('App listening at http://%s:%s', address.address, address.port);
});
