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

    this.loadImage('bubble', 'asset/bubble.png');

    this.loadAudio('bg', 'asset/romanesca.mp3');
    this.loadAudio('water', 'asset/Water Lake.mp3');
    this.loadAudio('whale', 'asset/Whale Sounds.mp3');
    this.loadAudio('sweep', 'asset/Sweep Motion.mp3');
  }
}

export default Seabed;
