/*
Game
  Phaser game will handle cordova deviceready event by itself.
*/

import Loader from './loader'; // jshint ignore:line
import SoundManager from './sound-manager'; // jshint ignore:line
import Cover from './cover';
import Level from './level';
import seabedData from './data/seabed';

export default class Game extends Phaser.Game {
  constructor() {
    let width = 1024;
    let height = width / window.innerWidth * window.innerHeight;
    // let enableDebug = env != 'production';

    super({
      width, height,
    });

    this.levelCount = seabedData.levels.length;
    // this.fadeColor = 0xffffff;

    return this;
  }

  boot() {
    console.log('[Game] boot');

    super.boot();

    this.load = new Loader(this);
    this.sound = new SoundManager(this);
    this.sound.boot();

    // pause all sound when game is deactived.
    this.onPause.add(() => this.sound.pauseAll());
    this.onResume.add(() => this.sound.resumeAll());

    this.state.add('cover', new Cover(seabedData.cover));
    seabedData.levels.forEach((level, index) => {
      game.state.add(index, new Level(level));
    });
    this.state.start('cover');
  }

  // compile time env on mobile. or localhost in browser.
  get env() {
    return window.cordova && cordova.compileTime.env || process.env.BROWSER_ENV;
  }

  // scale width to fit screen.
  fitScreen() {
    if (this.scale.scaleMode != Phaser.ScaleManager.USER_SCALE) {
      console.log('[Game] fit screen');

      this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.scale.setUserScale(window.innerWidth / this.world.width);
      this.scale.pageAlignHorizontally = this.scale.pageAlignVertically = true;
    }
  }

  // pages loop: cover -> levels -> cover
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

  // slide left then start previous state.
  previous() {
    console.log('[Game] previous page');


    let previousStateKey = this.previousStateKey;

    if (previousStateKey) {
      this.add.tween(this.camera)
        .to({
          x: -this.world.width,
        }, 200, Phaser.Easing.Quadratic.InOut, true)
        .onComplete.addOnce(() => this.state.start(previousStateKey));
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

  // slide right then start previous state.
  next() {
    console.log('[Game] next page');

    let nextStateKey = this.nextStateKey;

    if (nextStateKey) {
      this.add.tween(this.camera)
        .to({
          x: this.world.width,
        }, 200, Phaser.Easing.Quadratic.InOut, true)
        .onComplete.addOnce(() => this.state.start(nextStateKey));
    } else {
      this.add.tween(this.camera)
        .to({
          x: 0,
        }, 100, Phaser.Easing.Quadratic.InOut, true);
    }
  }

  // fade effect between state switch.
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
