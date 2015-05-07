var debug = require('debug')('index'); // jshint ignore:line

require('babelify/node_modules/babel-core/polyfill');

import App from './app';
import Game from './game';
import Menu from './menu';
import Level from './level';

var app = window.app = new App();
var game = app.game = new Game();

game.state.add('menu', new Menu());

game.state.add('level1', new Level('asset/01-16-1.jpg', 'asset/01-16-2.jpg', [
  [64, 154, 80],
  [227, 202, 30],
  [355, 185, 80],
  [247, 395, 25],
  [429, 285, 22],
]));

game.state.add('level2', new Level('asset/01-18-1.jpg', 'asset/01-18-2.jpg', [
  [109, 63, 40],
  [411, 193, 50],
  [131, 356, 30],
  [306, 412, 30],
  [381, 418, 22],
]));

for (var i = 1; i <= 2; i++) {
  game.levels.push('level' + i);
}

game.state.start('menu');
