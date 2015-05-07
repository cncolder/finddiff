var debug = require('debug')('game'); // jshint ignore:line

/*
Phaser game
  it will handle cordova deviceready event by itself.
*/

class Game extends Phaser.Game {
  constructor() {
    super(1024, 768);

    this.levels = [];
  }

  fitScreen() {
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.scale.setUserScale(window.innerWidth / this.world.width);

    // var hscale = window.innerWidth / this.world.width;
    // var vscale = window.innerHeight / this.world.height;
    // this.scale.setUserScale(Math.min(hscale, vscale));

    this.scale.pageAlignHorizontally = this.scale.pageAlignVertically = true;
  }

  previous() {
    if (this.state.current == this.levels[0]) {
      this.state.start('menu');
    } else {
      var index = this.levels.indexOf(this.state.current);

      this.state.start(this.levels[index - 1]);
    }
  }

  next() {
    if (this.state.current == 'menu') {
      this.state.start(this.levels[0]);
    } else {
      var index = this.levels.indexOf(this.state.current);

      this.state.start(this.levels[index + 1]);
    }
  }
}

export
default Game;
