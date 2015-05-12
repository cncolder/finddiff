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

    this.loadAudioOnce('bg', 'asset/romanesca.mp3');
    this.loadAudioOnce('water', 'asset/Water Lake.mp3');
    this.loadAudioOnce('whale', 'asset/Whale Sounds.mp3');
    this.loadAudioOnce('sweep', 'asset/Sweep Motion.mp3');
  }
}

export default Seabed;
