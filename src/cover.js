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
  }

  preload() {
    super.preload();

    let code = this.data.code;

    this.data.images.forEach(({
      i
    }) => {
      this.load.image(`img${i}`, `img/${code}${i}.png`);
    });

    this.load.image('bubble', 'img/bubble.png');

    this.load.audio('whale', 'sounds/Whale Sounds.m4a');
    this.load.audio('sweep', 'sounds/Sweep Motion.m4a');
  }

  create() {
    super.create();

    this.data.images.forEach(({
      i, h, v
    }) => {
      let x = this.world.width * h;
      let y = this.maxHeight * v + this.top;

      let item = this[`img${i}`] = this.add.image(x, y, `img${i}`);

      item.anchor.setTo(0.5, 0.5);

      item.inputEnabled = true;
      item.events.onInputUp.add(this.onInputUp, this);
      item.events.onDragStop.add(this.onDragStop, this);

      if (this.env == 'development' && this.game.device.chrome) {
        item.input.enableDrag();
      }
    });

    // find difference
    this.img2.events.onInputUp.add(this.onInputUp, this);

    // rainbow
    this.img4.sendToBack();

    // add animate tweens
    this.addTextScaleTweens();
    this.addWaveTweens();
    this.addBubbleEmitter();

    this.soundEffect = {
      whale: this.sound.play('whale', 0.4),
      sweep: this.sound.play('sweep', 0.6),
    };
  }

  shutdown() {
    super.shutdown();

    Object.keys(this).forEach(key => {
      if (/^img\d+$/.test(key)) {
        this[key] = null;
      }
    });

    Object.entries(this.soundEffect).forEach(([key, value]) => value.stop());
    this.soundEffect = null;
  }

  addTextScaleTweens() {
    let x = 1.05;
    let y = x;

    this.add.tween(this.img2.scale).to({
      x, y,
    }, 1500, Phaser.Easing.Default, true, 0, -1, true);
  }

  // up down animate, like swiming.
  addWaveTweens() {
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
      let img = this[`img${i}`];
      let duration = this.rnd.between(1000, 2000); // animate speed
      let distance = this.rnd.between(3, 5); // animate offset

      this.add.tween(img).to({
        y: img.position.y + distance,
      }, duration, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
    });
  }

  // bubble pop up with explore effect.
  addBubbleEmitter() {
    let emitter = this.add.emitter(
      this.world.centerX, this.world.height, 15
    );

    emitter.width = this.world.width;
    emitter.makeParticles('bubble');
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 1;
    emitter.setXSpeed(0, 0);
    emitter.setYSpeed(-300, -500);
    emitter.setRotation(0, 0);
    emitter.start(false, 2500);
  }

  mute() {
    this.sound.mute = !this.sound.mute;
  }

  onInputUp(image, pointer, over) {
    let distance = pointer.position.distance(pointer.positionDown);

    // not tap, is drag move.
    if (!over || distance > this.inputCircle.radius) {
      return;
    }

    // find difference
    if (image.key == 'img2') {
      return this.game.next();
    }

    // whale roar sound
    if (image.key == 'img4') {
      let sound = this.soundEffect.whale;

      return sound.isPlaying || sound.play();
    }

    // submarine sound
    if (image.key == 'img8') {
      let sound = this.soundEffect.sweep;

      return sound.isPlaying || sound.play();
    }
  }

  onDragStop(e) {
    let {
      x, y
    } = e.position;
    let h = x / this.world.width;
    let v = y / this.world.height;

    console.log('drag', e.key, x, y, h, v);
  }

  // onPause() {
  //   Object.entries(this.backgroundMusic || {}).forEach(([key, value]) => {
  //     value.pause();
  //   });
  //   Object.entries(this.soundEffect || {}).forEach(([key, value]) => {
  //     value.stop();
  //   });
  //
  //   // let device = this.game.device;
  //   //
  //   // if (device.android && !device.webAudio) {
  //   //   let entries = Object.entries(this.backgroundMusic || {});
  //   //
  //   //   entries.forEach(([key, value]) => value.pause());
  //   // }
  // }
  //
  // onResume() {
  //   Object.entries(this.backgroundMusic || {}).forEach(([key, value]) => {
  //     value.resume();
  //   });
  //
  //   // let device = this.game.device;
  //   //
  //   // if (device.android && !device.webAudio) {
  //   //   let entries = Object.entries(this.backgroundMusic || {});
  //   //
  //   //   entries.forEach(([key, value]) => value.resume());
  //   // }
  // }
}

export default Cover;
