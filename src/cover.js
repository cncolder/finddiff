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

    if (!this.game.onPause.has(this.onPause, this)) {
      this.game.onPause.add(this.onPause, this);
    }
    if (!this.game.onResume.has(this.onResume, this)) {
      this.game.onResume.add(this.onResume, this);
    }

    this.stage.backgroundColor = this.data.backgroundColor;
  }

  preload() {
    super.preload();

    let code = this.data.code;

    this.data.images.forEach(({
      i
    }) => {
      this.load.image(`img${i}`, `img/${code}${i}.png`);
    });

    this.loadImage('bubble', 'img/bubble.png');
  }

  create() {
    super.create();

    this.data.images.forEach(({
      i, h, v
    }) => {
      let x = this.world.width * h;
      let y = this.world.height * v;
      let item = this[`img${i}`] = this.add.image(x, y, `img${i}`);

      item.anchor.setTo(0.5, 0.5);

      item.inputEnabled = true;
      item.events.onInputUp.add(this.onInputUp, this);
      item.events.onDragStop.add(this.onDragStop, this);

      if (this.env == 'development') {
        item.input.enableDrag();
      }
    });

    // find difference
    this.img2.events.onInputUp.add(this.game.next, this.game);

    // rainbow
    this.img4.sendToBack();

    this.addWaveTweens();

    this.addBubbleEmitter();

    this.addMusic();

    // this.add.button(96 + 50, 0, 'sound', this.mute, this);
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
    emitter.setYSpeed(-300, -500);
    emitter.setXSpeed(-5, 5);
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.start(false, 2500, 200, 0);
  }

  addMusic() {
    // background music
    if (!this.backgroundMusic) {
      let bg = this.playAudio('bg', 0.5, true);
      let water = this.playAudio('water', 0.2, true);

      this.backgroundMusic = {
        bg, water,
      };
    }

    // sound effect
    if (!this.soundEffect) {
      let whale = this.playAudio('whale', 0.4);
      let sweep = this.playAudio('sweep', 0.6);

      this.soundEffect = {
        whale, sweep,
      };
    }
  }

  mute() {
    this.sound.mute = !this.sound.mute;
  }

  onInputUp(e) {
    // whale roar sound
    if (e.key == 'img4') {
      this.soundEffect.whale.play();
    }

    // submarine sound
    if (e.key == 'img8') {
      this.soundEffect.sweep.play();
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

  onPause() {
    Object.entries(this.backgroundMusic || {}).forEach(([key, value]) => {
      value.pause();
    });
    Object.entries(this.soundEffect || {}).forEach(([key, value]) => {
      value.stop();
    });

    // let device = this.game.device;
    //
    // if (device.android && !device.webAudio) {
    //   let entries = Object.entries(this.backgroundMusic || {});
    //
    //   entries.forEach(([key, value]) => value.pause());
    // }
  }

  onResume() {
    Object.entries(this.backgroundMusic || {}).forEach(([key, value]) => {
      value.resume();
    });

    // let device = this.game.device;
    //
    // if (device.android && !device.webAudio) {
    //   let entries = Object.entries(this.backgroundMusic || {});
    //
    //   entries.forEach(([key, value]) => value.resume());
    // }
  }
}

export default Cover;
