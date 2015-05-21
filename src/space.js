/*
Space
  the dream space.
*/

import State from './state';

export default class Space extends State {
  constructor() {
    super();
  }

  preload() {
    super.preload();

    // http://magnatune.com/artists/albums/sieber-hidden?song=1
    this.loadAudio('bg', 'music/Maenam.m4a');
  }
}
