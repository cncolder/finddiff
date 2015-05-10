const log = require('debug')('game'); // jshint ignore:line

/*
Phaser game
  it will handle cordova deviceready event by itself.
*/

class Game extends Phaser.Game {
  constructor() {
    super(1024, 768);

    this.levels = [];
    this.fadeColor = 0xffffff;
  }

  fitScreen() {
    // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.scale.setUserScale(window.innerWidth / this.world.width);
    this.scale.pageAlignHorizontally = this.scale.pageAlignVertically = true;
  }

  previous() {
    if (this.state.current == this.levels[0]) {
      this.fade('cover');
    } else {
      var index = this.levels.indexOf(this.state.current);

      this.fade(this.levels[index - 1]);
    }
  }

  next() {
    if (this.state.current == 'cover') {
      this.fade(this.levels[0]);
    } else {
      var index = this.levels.indexOf(this.state.current);

      this.fade(this.levels[index + 1]);
    }
  }

  // http://www.html5gamedevs.com/topic/2016-rectangle-fade/
  fade(state) {
    let mask = this.add.graphics(0, 0);

    mask.beginFill(this.fadeColor, 1);
    mask.drawRect(0, 0, this.width, this.height);
    mask.alpha = 0;
    mask.endFill();

    this.add.tween(mask).to({
        alpha: 0.5,
      }, 200, Phaser.Easing.Default, true)
      .onComplete.addOnce(function(graphic, tween) {
        this.state.start(state);
        tween.to({
          alpha: 0,
        }, 500, Phaser.Easing.Default, true, 500);
      }, this);
  }
}

export default Game;
