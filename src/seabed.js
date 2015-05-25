/*
Seabed
  the magical seabed world.
*/

import State from './state';

let bgMusic = {};

export default class Seabed extends State {
  constructor() {
    super();
  }

  init() {
    console.log('[State]', this.key, 'init');

    super.init();

    this.stage.backgroundColor = '#aaddf2';
  }

  preload() {
    console.log('[State]', this.key, 'preload');

    super.preload();

    // http://magnatune.com/artists/albums/fulton-once?song=4
    this.load.audio('bg', 'music/Romanesca.m4a');

    this.load.audio('water', 'music/Water Lake.m4a');
  }

  create() {
    console.log('[State]', this.key, 'create');

    super.create();

    bgMusic.bg = bgMusic.bg || this.sound.play('bg', 0.5);
    bgMusic.water = bgMusic.water || this.sound.play('water', 0.2);

    Object.entries(bgMusic).forEach(([key, sound]) => {
      return !sound.isPlaying && sound.play();
    });
  }

  static get bgMusic() {
    return bgMusic;
  }
}
