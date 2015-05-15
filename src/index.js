process.env.BROWSER_ENV = location.host == 'localhost:3000' ?
  'development' : 'production';

require('babelify/node_modules/babel-core/polyfill');

import fetch from 'whatwg-fetch'; // jshint ignore:line
import log from './log'; // jshint ignore:line
import App from './app';
import Game from './game';
import Cover from './cover';
import Level from './level';
import data from './data';

let app = window.app = new App();
let game = app.game = new Game();

game.app = app;

game.state.add('cover', new Cover(data.seabed.cover), true);

data.seabed.levels.forEach((level, index) => {
  let key = `level${index + 1}`;

  game.state.add(key, new Level(level));
  game.levels.push(key);
});
