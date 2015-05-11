const log = require('debug')('cover'); // jshint ignore:line

/*
Cover
  the cover of magic seabed world.
*/

import Seabed from './seabed';

class Cover extends Seabed {
  constructor(data) {
    super();

    this.data = data;
  }

  init() {
    super.init();

    this.stage.backgroundColor = this.data.backgroundColor;
  }

  preload() {
    super.preload();

    let code = this.data.code;

    this.data.images.forEach(function({
      i
    }) {
      this.load.image(`img${i}`, `asset/${code}${i}.png`);
    }, this);
  }

  create() {
    super.create();

    this.data.images.forEach(function({
      i, h, v
    }) {
      let x = this.world.width * h;
      let y = this.world.height * v;
      let item = this[`img${i}`] = this.add.image(x, y, `img${i}`);

      item.anchor.setTo(0.5, 0.5);

      item.inputEnabled = true;
      item.events.onInputUp.add(this.onInputUp, this);
      item.events.onDragStop.add(this.onDragStop, this);

      if (process.JS_ENV == 'development') {
        item.input.enableDrag();
      }
    }, this);

    // find difference
    this.img2.events.onInputUp.add(this.game.next, this.game);

    // rainbow
    this.img4.sendToBack();

    // up down animate, like swiming.
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function(i) {
      let img = this[`img${i}`];
      let duration = this.rnd.between(1000, 2000); // animate speed
      let distance = this.rnd.between(3, 5); // animate offset

      this.add.tween(img).to({
        y: img.position.y + distance,
      }, duration, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
    }, this);

    this.bubble();

    // background music loop
    if (!this.backgroundMusic) {
      this.backgroundMusic = this.sound.play('bg', 0.5, true);
      this.sound.play('water', 0.2, true);
    }
    this.sound.play('whale', 0.4);
    // this.sound.mute = true;

    // begin
    // this.add.button(
    //   this.world.width - 96, 0, 'next', this.game.next, this.game
    // );
    // this.add.button(96 + 50, 0, 'sound', this.mute, this);
  }

  // bubble pop up with explore effect.
  bubble() {
    let emitter = this.add.emitter(this.world.centerX, this.world.height, 15);

    emitter.width = this.world.width;
    emitter.makeParticles('bubble');
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 1;
    emitter.setYSpeed(-300, -500);
    emitter.setXSpeed(-5, 5);
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.start(false, 2500, 200, 0);
  }

  onInputUp(e) {
    // whale roar sound
    if (e.key == 'img4') {
      this.sound.play('whale', 0.6);
    }

    // submarine sound
    if (e.key == 'img8') {
      this.sound.play('sweep', 0.6);
    }
  }

  onDragStop(e) {
    let {
      x, y
    } = e.position;
    let h = x / this.world.width;
    let v = y / this.world.height;

    log('drag', e.key, x, y, h, v);
  }

  mute() {
    this.sound.mute = !this.sound.mute;
  }
}

export default Cover;
