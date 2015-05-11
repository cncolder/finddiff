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

    this.loadImageOnce('bubble', 'asset/bubble.png');

    this.loadAudioOnce('bg', 'asset/romanesca.ogg');
    this.loadAudioOnce('water', 'asset/Water Lake.ogg');
    this.loadAudioOnce('whale', 'asset/Whale Sounds.ogg');
  }
}

export default Seabed;
