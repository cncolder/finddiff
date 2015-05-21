/*
Tour
  round the world tour.
*/

import State from './state';

export default class Tour extends State {
  constructor() {
    super();
  }

  preload() {
    super.preload();

    // http://magnatune.com/artists/albums/shira-wildwood?song=15
    this.loadAudio('bg', 'music/Lullaby Set.m4a');
  }
}
