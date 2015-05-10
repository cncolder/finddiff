const log = require('debug')('level'); // jshint ignore:line

/*
Level
  The level of magic seabed world.
*/

import Seabed from './seabed';

class Level extends Seabed {
  constructor(data) {
    super();

    this.data = data;
  }

  init() {
    super.init();

    let difference = this.data.difference;
    let length = Math.max(difference[0].length, difference[1].length);
    let found = this.found = [];

    for (var i = 0; i < length; i++) {
      found.push({
        items: [],
      });
    }
  }

  preload() {
    super.preload();

    let code = this.data.code;

    this.load.image('img1', `asset/${code}1.png`);
    this.load.image('img2', `asset/${code}2.png`);

    [1, 2].forEach(function(i) {
      this.data.difference[i - 1].forEach(function({
        h, v
      }, j) {
        if (!h) {
          return;
        }

        j += 1;

        let key = `img${i}${j}`;
        let path = `asset/${code}${i}${j}.png`;

        this.load.image(key, path);
      }, this);
    }, this);

    this.load.audio('found', 'asset/Bell Transition.ogg');
  }

  create() {
    super.create();

    this.img1 = this.add.image(0, 0, 'img1');
    this.img2 = this.add.image(this.world.centerX, 0, 'img2');

    [1, 2].forEach(function(i) {
      this.data.difference[i - 1].forEach(function({
        h, v
      }, j) {
        if (!h) {
          return;
        }

        j += 1;

        let x = this[`img${i}`].position.x + this[`img${i}`].width * h;
        let y = this[`img${i}`].position.y + this[`img${i}`].height * v;
        let key = `img${i}${j}`;
        let item = this[key] = this.add.image(x, y, key);

        item.index = j - 1;
        this.found[item.index].items[i - 1] = item;

        item.anchor.setTo(0.5, 0.5);

        // Give tappable controls a hit target of about 44 x 44 points. https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/LayoutandAppearance.html
        if ((item.width + item.height) / 2 < 44) {
          item.hitArea = new Phaser.Circle(0, 0, 44);
        }

        item.inputEnabled = true;
        item.events.onInputUp.add(this.onInputUp, this);

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

  onInputUp(e) {
    log(e);

    let found = this.found[e.index];

    if (found.checked) {
      return;
    }

    found.checked = true;

    // shine and scale animate for both item.
    found.items.forEach(function(item) {
      if (item) {
        this.shine(item);
      }
    }, this);

    // play a success sound.
    this.sound.play('found', 1);

    // if all answer found then goto next level.
    if (this.found.every(function(found) {
        return found.checked;
      })) {
      this.game.next();
    }
  }

  shine(e) {
    e.blendMode = PIXI.blendModes.ADD;
    // e.tint = 0xff0000;
    // this.add.tween(e).to({
    //   tint: 0xee0000,
    // }, 20000, Phaser.Easing.Default, true, 0, -1, true);

    let x, y;
    // small item scale with a large factor.
    x = y = (e.width + e.height) / 2 > 50 ? 1.2 : 1.5;

    // scale large
    this.add.tween(e.scale).to({
      x, y,
    }, 1000, Phaser.Easing.Default, true, 0, -1, true);
  }
}

export default Level;
