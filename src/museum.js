/*
Museum
  the funny openday of museum.
*/

import State from './state';

export default class Museum extends State {
  constructor() {
    super();
  }

  preload() {
    super.preload();

    // http://magnatune.com/artists/albums/sieber-second?song=8
    this.loadAudio('bg', 'music/Long Past Gone.m4a');
  }
}
