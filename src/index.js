process.env.BROWSER_ENV = location.host == 'localhost:3000' ?
  'development' : 'production';

// jshint ignore:start
import polyfill from 'babelify/node_modules/babel-core/polyfill';
import fetch from 'whatwg-fetch';
import log from './log';
// jshint ignore:end
import App from './app';
import Game from './game';

window.app = new App();
window.game = new Game();
