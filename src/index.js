process.env.BROWSER_ENV = location.host == 'localhost:3000' ?
  'development' : 'production';

require('babelify/node_modules/babel-core/polyfill');

import fetch from 'whatwg-fetch'; // jshint ignore:line
import log from './log'; // jshint ignore:line
import App from './app';
import Game from './game';
import Cover from './cover';
import Level from './level';
import Ending from './ending';
import seabedData from './data/seabed';

window.app = new App();

let game = window.game = new Game();

game.state.add('cover', new Cover(seabedData.cover), true);

seabedData.levels.forEach((level, index) => {
  game.state.add(index, new Level(level));
});

game.levelCount = seabedData.levels.length;

game.state.add('ending', new Ending());

game.state.start('cover');
