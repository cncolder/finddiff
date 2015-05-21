/*
Playground
  pleasure playground note.
*/

import State from './state';

export default class Playground extends State {
  constructor() {
    super();
  }

  preload() {
    super.preload();

    // http://magnatune.com/artists/albums/shira-waters?song=2
    this.loadAudio('bg', 'music/Downstream.m4a');
  }
}
