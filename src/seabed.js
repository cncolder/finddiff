const log = require('debug')('seabed'); // jshint ignore:line

/*
Seabed
  the magic seabed world.
*/

import State from './state';

class Seabed extends State {
  constructor() {
    super();
  }

  preload() {
    super.preload();

    this.load.image('bubble', 'asset/bubble.png');

    this.load.audio('bg', 'asset/romanesca.ogg');
    this.load.audio('water', 'asset/Water Lake.ogg');
    this.load.audio('whale', 'asset/Whale Sounds.ogg');
  }
}

export default Seabed;
