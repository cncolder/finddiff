var debug = require('debug')('index'); // jshint ignore:line

/*
Menu
  the menu and cover of game.
*/

import State from './state';

class Menu extends State {
  init() {
    this.game.fitScreen();
  }

  preload() {
    this.load.image('background', 'asset/cover.jpg');
    this.load.image('bubble', 'asset/bubble.png');
    this.load.image('previous', 'asset/previous.png');
    this.load.image('next', 'asset/next.png');
    // this.load.image('sound', 'asset/sound.png');
    this.load.image('ok', 'asset/ok.png');

    this.load.audio('background', 'asset/romanesca.mp3');
    this.load.audio('success', 'asset/success.mp3');
  }

  create() {
    this.add.image(0, 0, 'background');

    var emitter = this.add.emitter(this.world.centerX, this.world.height, 20);

    emitter.width = this.world.width;

    emitter.makeParticles('bubble');

    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 1;

    emitter.setYSpeed(-300, -500);
    emitter.setXSpeed(-5, 5);

    emitter.minRotation = 0;
    emitter.maxRotation = 0;

    emitter.start(false, 2500, 50, 0);

    if (!this.backgroundMusic) {
      this.backgroundMusic = this.sound.play('background', 0.5, true);
    }
    // this.sound.mute = true;

    this.add.button(
      this.world.width - 96, 0, 'next', this.game.next, this.game
    );
    // this.add.button(96 + 50, 0, 'sound', this.mute, this);
  }

  mute() {
    this.sound.mute = !this.sound.mute;
  }
}

export
default Menu;
