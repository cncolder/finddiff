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

    // http://magnatune.com/artists/albums/fulton-once?song=4
    this.loadAudio('bg', 'music/Romanesca');

    this.loadAudio('water', 'sounds/Water Lake');
    this.loadAudio('whale', 'sounds/Whale Sounds');
    this.loadAudio('sweep', 'sounds/Sweep Motion');
  }
}

export default Seabed;
