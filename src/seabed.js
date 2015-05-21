/*
Seabed
  the magical seabed world.
*/

import State from './state';

export default class Seabed extends State {
  constructor() {
    super();
  }

  preload() {
    super.preload();

    // http://magnatune.com/artists/albums/fulton-once?song=4
    this.loadAudio('bg', 'music/Romanesca.m4a');

    this.loadAudio('water', 'sounds/Water Lake.m4a');
    this.loadAudio('whale', 'sounds/Whale Sounds.m4a');
    this.loadAudio('sweep', 'sounds/Sweep Motion.m4a');
  }
}
