const log = require('debug')('level'); // jshint ignore:line

/*
Menu
  The cover and menu of game.
*/

import State from './state';

class Level extends State {
  constructor(data) {
    super();

    this.data = data;
  }

  init() {
    this.found = [false, false, false, false, false, ];
  }

  preload() {
    let prefix = this.data.prefix;

    this.load.image('img1', `asset/${prefix}1.png`);
    this.load.image('img2', `asset/${prefix}2.png`);

    [1, 2].forEach(function(i) {
      this.data.difference[i - 1].forEach(function(config, j) {
        j += 1;

        let key = `img${i}${j}`;
        let path = `asset/${prefix}${i}${j}.png`;

        this.load.image(key, path);
      }, this);
    }, this);

    this.load.audio('found', 'asset/Bell Transition.mp3')
  }

  create() {
    this.img1 = this.add.image(0, 0, 'img1');
    this.img2 = this.add.image(this.world.centerX, 0, 'img2');

    [1, 2].forEach(function(i) {
      this.data.difference[i - 1].forEach(function({
        h, v
      }, j) {
        j += 1;

        let x = this[`img${i}`].position.x + this[`img${i}`].width * h;
        let y = this[`img${i}`].position.y + this[`img${i}`].height * v;
        let key = `img${i}${j}`;
        let item = this[key] = this.add.image(x, y, key);

        if (item.width < 44 || item.height < 44) {
          log(item.key, 'too small', item.width, item.height);
        }

        item.index = j - 1;

        item.anchor.setTo(0.5, 0.5);

        item.inputEnabled = true;
        item.events.onInputDown.add(this.onInputDown, this);

        item.input.enableDrag();
        item.events.onDragStop.add(this.onDragStop, this);
      }, this);
    }, this);

    this.add.button(
      0, 0, 'previous', this.game.previous, this.game
    );
    this.add.button(
      this.world.width - 96, 0, 'next', this.game.next, this.game
    );
  }

  onDragStop(e) {
    let l = this.img1.toLocal(e.position);
    let h = l.x / this.img1.width;
    let v = l.y / this.img1.height;

    if (l.x > this.world.centerX) {
      l = this.img2.toLocal(e.position);
      h = l.x / this.img2.width;
      v = l.y / this.img2.height;
    }

    log('drag', e.key, l.x, l.y, h, v);
  }

  onInputDown(e) {
    log(e);

    if (e.checked) {
      return;
    }

    e.blendMode = PIXI.blendModes.ADD;
    e.tint = 0xff0000;
    this.add.tween(e).to({
      tint: 0xee0000,
    }, 20000, Phaser.Easing.Linear.None, true, 0, 10000, true);

    this.sound.play('found', 1);

    e.checked = this.found[e.index] = true;

    if (this.found.every(function(found) {
        return found;
      })) {
      this.game.next();
    }
  }
}

export default Level;
