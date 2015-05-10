const log = require('debug')('index'); // jshint ignore:line

/*
Menu
  the menu and cover of game.
*/

import State from './state';

class Cover extends State {
  constructor(data) {
    super();

    this.data = data;
  }

  init() {
    this.game.fitScreen();
    this.stage.backgroundColor = this.data.backgroundColor;
  }

  preload() {
    let prefix = this.data.prefix;

    this.data.images.forEach(function({
      i
    }) {
      this.load.image(`img${i}`, `asset/${prefix}${i}.png`);
    }, this);

    // this.load.image('bg', 'asset/bg.png');
    this.load.image('bubble', 'asset/bubble.png');
    this.load.image('previous', 'asset/previous.png');
    this.load.image('next', 'asset/next.png');
    // this.load.image('sound', 'asset/sound.png');

    this.load.audio('bg', 'asset/romanesca.ogg');
    this.load.audio('water', 'asset/Water Lake.ogg');
    this.load.audio('whale', 'asset/Whale Sounds.ogg');
    this.load.audio('sweep', 'asset/Sweep Motion.ogg');
  }

  create() {
    this.data.images.forEach(function({
      i, h, v
    }) {
      let x = this.world.width * h;
      let y = this.world.height * v;
      let item = this[`img${i}`] = this.add.image(x, y, `img${i}`);

      item.anchor.setTo(0.5, 0.5);

      item.inputEnabled = true;
      item.events.onInputDown.add(this.onInputDown, this);
      // item.input.enableDrag();
      item.events.onDragStop.add(this.onDragStop, this);
    }, this);

    // find difference
    this.img2.events.onInputDown.add(this.game.next, this.game);

    // rainbow
    this.img4.sendToBack();

    // girl and fish, up down animate, like swiming.
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

  // bubble up with explore.
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

  onInputDown(e) {
    if (e.key == 'img4') {
      this.sound.play('whale', 0.6);
    }

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
