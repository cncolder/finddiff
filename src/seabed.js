/*
Seabed
  the magical seabed world.
*/

import State from './state';

let bgMusic = {};
let soundEffect = {};

export default class Seabed extends State {
  constructor() {
    super();
  }

  init() {
    super.init();

    this.stage.backgroundColor = '#aaddf2';
  }

  preload() {
    super.preload();

    // http://magnatune.com/artists/albums/fulton-once?song=4
    this.loadAudio('bg', 'music/Romanesca.m4a');
    this.loadAudio('water', 'music/Water Lake.m4a');
    this.loadAudio('ed', 'music/Laureate.m4a');
  }

  create() {
    super.create();

    this.playMusic();
  }

  static get bgMusic() {
    return bgMusic;
  }

  static get soundEffect() {
    return soundEffect;
  }

  playMusic() {
    let play = (...args) => {
      args.forEach(sound => sound && !sound.isPlaying && sound.play());
    };
    let stop = (...args) => {
      args.forEach(sound => sound && sound.stop());
    };

    if (this.key != 'ending') {
      stop(bgMusic.ed);

      bgMusic.bg = bgMusic.bg || this.playAudio('bg', 0.5);
      play(bgMusic.bg);

      bgMusic.water = bgMusic.water || this.playAudio('water', 0.2);
      play(bgMusic.water);
    } else {
      stop(bgMusic.bg, bgMusic.water);

      bgMusic.ed = bgMusic.ed || this.playAudio('ed', 0.8);
      play(bgMusic.ed);
    }
  }
}
