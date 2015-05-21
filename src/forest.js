/*
Forest
  the wonderful forest kingdom.
*/

import State from './state';

export default class Forest extends State {
  constructor() {
    super();
  }

  preload() {
    super.preload();

    // http://magnatune.com/artists/albums/sieber-second?song=2
    this.loadAudio('bg', 'music/Tell It By Heart.m4a');
  }
}
