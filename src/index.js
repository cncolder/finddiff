var log = require('debug')('index'); // jshint ignore:line

require('babelify/node_modules/babel-core/polyfill');

import App from './app';
import Game from './game';
import Cover from './cover';
import Level from './level';
import data from './data';

var app = window.app = new App();
var game = app.game = new Game();

game.state.add('cover', new Cover(data.cover));

data.levels.forEach(function(level, index) {
  let key = `level${index + 1}`;

  game.state.add(key, new Level(level));
  game.levels.push(key);
});

game.state.start('cover');