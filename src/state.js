const log = require('debug')('state'); // jshint ignore:line

/*
State
  game state base class.
*/

class State {
  constructor() {}

  init() {
    this.game.fitScreen();
  }

  preload() {
    this.loadImageOnce('previous', 'asset/previous.png');
    this.loadImageOnce('next', 'asset/next.png');
    // this.load.image('sound', 'asset/sound.png');

    this.loadAudioOnce('sweep', 'asset/Sweep Motion.ogg');
  }

  create() {}

  update() {}

  render() {
    if (!navigator.isCocoonJS) {
      if (!this.time.advancedTiming) {
        this.time.advancedTiming = true;
      }

      let fps = this.game.time.fps;

      this.game.debug.text(`fps:${fps}`, 0, 12);
    }
  }

  assign(obj) {
    Object.assign(this, obj);
  }

  loadImageOnce(key, path) {
    if (!this.cache.checkImageKey(key)) {
      this.load.image(key, path);
    }
  }

  loadAudioOnce(key, path) {
    if (!this.cache.checkSoundKey(key)) {
      this.load.audio(key, path);
    }
  }
}

export default State;
