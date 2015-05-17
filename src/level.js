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

    this.load.image('img1', `img/${code}1.png`);
    this.load.image('img2', `img/${code}2.png`);

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

    this.loadAudio('bell', 'sounds/Bell Transition');
  }

  create() {
    super.create();

    this.img1 = this.add.image(0, 0, 'img1');
    this.img2 = this.add.image(this.world.centerX, 0, 'img2');
    this.img1.cacheAsBitmap = this.img2.cacheAsBitmap = true;
    this.img1.smoothed = this.img2.smoothed = false;

    // show level number
    let level = parseInt(this.data.code) - 100;
    let text = this.add.text(this.world.centerX, 0, ` ${level} `, {
      align: 'center',
      font: 'Arial',
      fontWeight: 'bold',
      fontSize: this.world.width / 20,
    });
    text.anchor.setTo(0.5, 0);
    text.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 10);

    let grd = text.context.createLinearGradient(0, 0, 0, text.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    // a crab indicator for game progress.
    let crab = this.crab = this.add.image(
      this.world.centerX,
      this.img1.top + this.img1.height,
      'img7'
    );
    crab.anchor.setTo(0.5, 0.5);
    crab.scale.setTo(0.5, 0.5);

    [1, 2].forEach(i => {
      this.data.difference[i - 1].forEach(({
        h, v
      }, j) => {
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
        item.events.onDragStop.add(this.onDragStop, this);

        if (this.env == 'development') {
          item.input.enableDrag();
        }
      });
    });

    this.add.button(
      0, 0, 'previous', this.game.previous, this.game
    );

    let nextButton = this.add.button(
      this.world.width, 0, 'next', this.game.next, this.game
    );

    nextButton.anchor.setTo(1, 0);
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

  onInputUp(image) {
    let found = this.found[image.index];

    if (found.checked) {
      return;
    }

    found.checked = true;

    // shine and scale animate for both item.
    found.items.forEach(item => {
      if (item) {
        this.shine(item);
      }
    });

    // play a success sound.
    this.playAudio('bell');

    // game progress.
    let checked = this.found.filter(found => found.checked).length;
    let x = this.crab.x;
    let y = this.img1.bottom - this.img1.height * checked / this.found.length;

    this.add.tween(this.crab).to({
      x, y,
    }, 1000, Phaser.Easing.Elastic.Out, true);

    // if all answer found then goto next level.
    if (this.found.every(found => found.checked)) {
      this.game.next();
    }
  }
}

export default Level;
