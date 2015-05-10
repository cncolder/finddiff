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
    this.load.image('previous', 'asset/previous.png');
    this.load.image('next', 'asset/next.png');
    // this.load.image('sound', 'asset/sound.png');

    this.load.audio('sweep', 'asset/Sweep Motion.ogg');
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
}

export default State;
