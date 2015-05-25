/*
Phaser game
  it will handle cordova deviceready event by itself.
*/

class Game extends Phaser.Game {
  constructor() {
    super(1024, 768);

    this.levelCound = 0;
    // this.fadeColor = 0xffffff;
  }

  boot() {
    super.boot();

    this.onPause.add(() => this.sound.pauseAll());
    this.onResume.add(() => this.sound.resumeAll());
  }

  get env() {
    return window.cordova && cordova.compileTime.env || process.env.BROWSER_ENV;
  }

  fitScreen() {
    if (this.scale.scaleMode != Phaser.ScaleManager.USER_SCALE) {
      this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.scale.setUserScale(window.innerWidth / this.world.width);
      this.scale.pageAlignHorizontally = this.scale.pageAlignVertically = true;
    }
  }

  get previousStateKey() {
    let current = this.state.current;

    if (current == 'cover') {
      return this.levelCount - 1;
    } else if (current == '0') {
      return 'cover';
    } else {
      return `${parseInt(current, 10) - 1}`;
    }
  }

  previous() {
    let previousStateKey = this.previousStateKey;

    if (previousStateKey) {
      this.add.tween(this.camera)
        .to({
          x: -this.world.width,
        }, 200, Phaser.Easing.Quadratic.InOut, true)
        .onComplete.addOnce(() => {
          this.state.start(previousStateKey);
        });
    } else {
      this.add.tween(this.camera)
        .to({
          x: 0,
        }, 100, Phaser.Easing.Quadratic.InOut, true);
    }
  }

  get nextStateKey() {
    let current = this.state.current;

    if (current == 'cover') {
      return '0';
    } else if (!this.state.states[parseInt(current, 10) + 1]) {
      return 'cover';
    } else {
      return `${parseInt(current, 10) + 1}`;
    }
  }

  next() {
    let nextStateKey = this.nextStateKey;

    if (nextStateKey) {
      this.add.tween(this.camera)
        .to({
          x: this.world.width,
        }, 200, Phaser.Easing.Quadratic.InOut, true)
        .onComplete.addOnce(() => {
          this.state.start(nextStateKey);
        });
    } else {
      this.add.tween(this.camera)
        .to({
          x: 0,
        }, 100, Phaser.Easing.Quadratic.InOut, true);

      // let t = app.t;
      //
      // navigator.notification.alert(
      //   t `Game complete page is working out.`, () => {
      //     console.log('[Game] levels complete');
      //   }, t `Nothing else`
      // );
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
