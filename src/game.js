/*
Phaser game
  it will handle cordova deviceready event by itself.
*/

class Game extends Phaser.Game {
  constructor() {
    super(1024, 768); // 1.0
    // super(768, 576); // 0.75
    // super(512, 384); // 0.5

    this.levels = [];
    this.fadeColor = 0xffffff;
  }

  get env() {
    return process.env.BROWSER_ENV;
  }

  fitScreen() {
    if (this.scale.scaleMode != Phaser.ScaleManager.USER_SCALE) {
      this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.scale.setUserScale(window.innerWidth / this.world.width);
      this.scale.pageAlignHorizontally = this.scale.pageAlignVertically = true;
    }
  }

  previous() {
    if (this.state.current == this.levels[0]) {
      this.fade('cover');
    } else {
      let index = this.levels.indexOf(this.state.current);

      this.fade(this.levels[index - 1]);
    }
  }

  next() {
    if (this.state.current == 'cover') {
      this.fade(this.levels[0]);
    } else {
      let index = this.levels.indexOf(this.state.current);
      let state = this.levels[index + 1];

      if (this.state.checkState(state)) {
        this.fade(this.levels[index + 1]);
      } else {
        let t = app.t;

        navigator.notification.alert(
          t `Game complete page is working out.`, () => {
            console.log('[Game] levels complete');
          }, t `Nothing else`
        );
      }
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
      .onComplete.addOnce((graphic, tween) => {
        this.state.start(state);
        tween.to({
          alpha: 0,
        }, 500, Phaser.Easing.Default, true, 500);
      });
  }
}

export default Game;
