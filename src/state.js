const log = require('debug')('state'); // jshint ignore:line

/*
State
  game state base class.
*/

class State {
  constructor() {}

  assign(obj) {
    Object.assign(this, obj);
  }

  render() {
    if (!navigator.isCocoonJS) {
      if (!this.time.advancedTiming) {
        this.time.advancedTiming = true;
      }

      let fps = this.game.time.fps;

      this.game.debug.text(`fps:${fps}`, 0, 12);
    }
  }
}

export default State;
