/*
Level
  The level of magic seabed world.
*/

import Seabed from './seabed';
// import SeabedFilter from './filter/seabed-filter.js';

var colorIndex = 0;
const colors = Phaser.Color.HSLColorWheel();

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

    this.load.image('img1', `img/${code}1.jpg`);
    this.load.image('img2', `img/${code}2.jpg`);

    if (this.game.device.iPad) {
      this.load.image('whale', 'img/whale.png');
      // this.load.image('img3', 'img/1003.png');
      this.load.image('girl', 'img/1005.png');
      // this.load.image('img5', 'img/1006.png');
    }

    [1, 2].forEach(i => {
      this.data.difference[i - 1].forEach(({
        h, v
      }, j) => {
        if (!h) {
          return;
        }

        j += 1;

        let key = `img${i}${j}`;
        let path = `img/${code}${i}${j}.png`;

        this.load.image(key, path);
      });
    });

    this.load.image('submarine', 'img/1008.png');

    this.loadAudio('bell', 'sounds/Bell Transition.m4a');
  }

  create() {
    super.create();

    // let bgSprite = this.bgSprite = this.add.sprite();
    // bgSprite.width = this.world.width;
    // bgSprite.height = this.world.height;
    // bgSprite.filters = [new SeabedFilter(this.game)];

    let y = this.game.device.iPad ? this.iPadTop : 0;

    // background images
    this.img1 = this.add.image(0, y, 'img1');
    this.img2 = this.add.image(this.world.centerX, y, 'img2');
    // this.img1.cacheAsBitmap = this.img2.cacheAsBitmap = true;
    // this.img1.smoothed = this.img2.smoothed = false;

    if (this.game.device.iPad) {
      let whale = this.add.image(0, this.iPadBottom, 'whale');
      whale.scale.setTo(0.5);

      let girl = this.add.image(
        this.world.width, this.iPadStatusBarHeight, 'girl'
      );
      girl.anchor.setTo(1.5, 0);

      //   let img3 = this.add.image(this.world.centerX, this.img1.bottom, 'img3');
      //   img3.anchor.setTo(0.5, -0.5);
      //
      //   let img4 = this.add.image(0, this.img1.bottom, 'img4');
      //   img4.anchor.setTo(-1, -0.1);
      //
      //   let img5 = this.add.image(this.world.width, this.img1.bottom, 'img5');
      //   img5.anchor.setTo(3, -2);
      //
      [whale, girl].forEach(image => {
        image.sendToBack();

        let duration = this.rnd.between(2000, 3000); // animate speed
        let distance = this.rnd.between(4, 8); // animate offset

        this.add.tween(image).to({
          y: image.position.y + distance,
        }, duration, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
      });
    }

    // show spliter
    let spliter = this.add.graphics(this.world.centerX, y);
    spliter.lineStyle(this.world.width / 500, 0xffffff);
    spliter.lineTo(0, this.img1.height);

    // level up progress
    this.levelup = this.add.graphics(this.world.centerX, this.img1.bottom);

    // show level number
    let level = parseInt(this.data.code) - 100;
    let text = this.add.text(this.world.centerX, y, ` ${level} `, {
      align: 'center',
      font: 'Arial',
      fontWeight: 'bold',
      fontSize: this.world.width / 20,
    });
    text.anchor.setTo(0.5, 0);
    text.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 10);
    if (this.game.device.iPad) {
      text.y = this.iPadStatusBarHeight;
    }

    let grd = text.context.createLinearGradient(0, 0, 0, text.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    // different items
    [0, 1].forEach(i => {
      this.data.difference[i].forEach(({
        h, v
      }, j) => {
        // placeholder
        if (!h || !v) {
          let other = this.data.difference[i ? 0 : 1][j];

          h = other.h;
          v = other.v;

          let x = this[`img${i + 1}`].left + this[`img${i + 1}`].width * h;
          let y = this[`img${i + 1}`].top + this[`img${i + 1}`].height * v;
          let item = this.add.graphics(x, y);

          item.index = j;
          // this.found[j].items[i] = item;

          item.hitArea = this.inputCircle;

          item.inputEnabled = true;
          item.events.onInputUp.add(this.onInputUp, this);

          return;
        }

        let x = this[`img${i + 1}`].left + this[`img${i + 1}`].width * h;
        let y = this[`img${i + 1}`].top + this[`img${i + 1}`].height * v;
        let key = `img${i + 1}${j + 1}`;
        let item = this[key] = this.add.image(x, y, key);

        item.index = j;
        this.found[j].items[i] = item;

        item.anchor.setTo(0.5, 0.5);

        if ((item.width + item.height) / 2 < this.inputCircle.diameter) {
          item.hitArea = this.inputCircle;
        }

        item.inputEnabled = true;
        item.events.onInputUp.add(this.onInputUp, this);

        if (this.env == 'development' && this.game.device.chrome) {
          item.input.enableDrag();
          item.events.onDragStop.add(this.onDragStop, this);
        }
      });
    });

    let previousArrow = this.add.image(
      0, this.world.centerY, 'submarine'
    );
    previousArrow.anchor.setTo(-0.3, 0.5);
    previousArrow.scale.x = -1;

    let nextArrow = this.add.image(
      this.world.width, this.world.centerY, 'submarine'
    );
    nextArrow.anchor.setTo(-0.3, 0.5);

    [previousArrow, nextArrow].forEach(image => {
      image.sendToBack();

      let duration = this.rnd.between(2000, 3000); // animate speed
      let distance = this.rnd.between(4, 8); // animate offset

      this.add.tween(image).to({
        y: image.position.y + distance,
      }, duration, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
    });
  }

  update() {
    super.update();

    // this.bgSprite.filters[0].update();
  }

  shine(image) {
    image.blendMode = PIXI.blendModes.ADD;
    // image.tint = 0xff0000;
    // this.add.tween(image).to({
    //   tint: 0xee0000,
    // }, 20000, Phaser.Easing.Default, true, 0, -1, true);

    let d = (image.width + image.height) / 2;
    let x, y;
    // small item scale with a large factor.
    x = y =
      d < 44 ?
      1.4 :
      d < 100 ?
      1.2 :
      d < 200 ?
      1.05 :
      1.01;

    // scale large
    this.shineTweens = this.shineTweens || [];
    this.shineTweens.push(this.add.tween(image.scale).to({
      x, y,
    }, 1000, Phaser.Easing.Default, true, 0, -1, true));
  }

  colorFromWheel() {
    let color = colors[colorIndex];

    colorIndex = this.math.wrapValue(colorIndex, 111, 359);

    return color;
  }

  colorValueFromWheel() {
    let color = this.colorFromWheel();

    color = Phaser.Color.toRGBA(color.r, color.g, color.b);

    return color;
  }

  onDragStop(image) {
    let l = this.img1.toLocal(image.position);
    let h = l.x / this.img1.width;
    let v = l.y / this.img1.height;

    if (l.x > this.world.centerX) {
      l = this.img2.toLocal(image.position);
      h = l.x / this.img2.width;
      v = l.y / this.img2.height;
    }

    console.log('drag', image.key, l.x, l.y, h, v);
  }

  onInputUp(image, pointer, over) {
    let distance = pointer.position.distance(pointer.positionDown);

    // not tap, is drag move.
    if (!over || distance > this.inputCircle.radius) {
      return;
    }

    let found = this.found[image.index];

    if (found.checked) {
      return;
    }

    found.checked = true;

    // shine and scale animate for both item.
    found.items.forEach(item => {
      // if (item.type == Phaser.GRAPHICS) {
      //   item.lineStyle(this.inputCircle.radius / 20, 0xffffff);
      //   item.drawCircle(0, 0, this.inputCircle.radius);
      // }
      if (item) {
        this.shine(item);
      }
    });

    // play a success sound.
    this.playAudio('bell');

    // game progress.
    let checked = this.found.filter(found => found.checked).length;
    // let x = this.crab.x;
    let d = this.img1.height * checked / this.found.length;
    // let y = this.img1.bottom - d;

    // this.add.tween(this.crab).to({
    //   x, y,
    // }, 1000, Phaser.Easing.Elastic.Out, true);

    this.levelup
      .lineStyle(this.world.width / 200, this.colorValueFromWheel())
      .lineTo(0, -d);

    // if all answer found then goto next level.
    if (this.found.every(found => found.checked)) {
      this.game.next();
    }
  }
}

export default Level;
