process.env.BROWSER_ENV = location.host == 'localhost:3000' ?
  'development' : 'production';

require('babelify/node_modules/babel-core/polyfill');

import log from './log'; // jshint ignore:line
import App from './app';
import Game from './game';

window.app = new App();
window.game = new Game();
