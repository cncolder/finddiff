var debug = require('debug')('level'); // jshint ignore:line

/*
Menu
  The cover and menu of game.
*/

import State from './state';

let marginTop = 60;

class Level extends State {
  constructor(path1, path2, answer) {
    super();

    this.assign({
      marginTop, path1, path2, answer,
    });
  }

  init() {
    this.game.fitScreen();
  }

  preload() {
    this.load.image('img1', this.path1);
    this.load.image('img2', this.path2);
    this.load.image('img11', 'asset/01-16-1-1.png');
  }

  create() {
    var img1 = this.add.image(0, this.marginTop, 'img1');

    img1.inputEnabled = true;
    img1.events.onInputDown.add(this.press, this);

    var img2 = this.add.image(this.world.centerX, this.marginTop, 'img2');
    img2.inputEnabled = true;
    img2.events.onInputDown.add(this.press, this);

    var btn11 = this.add.button(
      20, this.marginTop + 77, 'img11', function () {
        console.log(arguments);
      }, this
    );
    this.game.btn11 = btn11;

    this.add.button(0, 0, 'previous', this.game.previous, this.game);
    this.add.button(this.world.width - 96, 0, 'next',
      this.game.next, this.game);
    // this.add.button(96 + 50, 0, 'sound', this.mute, this);

    this.answer.forEach(function(answer) {
      delete answer.checked;
    });

    this.assign({
      img1, img2,
    });
  }

  press(el, point) {
    var local = el.toLocal(point);
    debug('press', local.x, local.y);

    for (var i = 0; i < this.answer.length; i++) {
      var answer = this.answer[i];

      if (answer.checked) {
        continue;
      }

      var x = answer[0];
      var y = answer[1];
      var r = answer[2];
      var distance = local.distance({
        x, y,
      });

      if (distance < r) {
        var ok = this.add.image(point.x, point.y, 'ok');

        ok.anchor.setTo(0.5, 0.5);

        answer.checked = true;

        this.sound.play('success', 1);

        break;
      }
    }

    if (this.answer.every(function(answer) {
      return answer.checked;
    })) {
      this.game.next();
    }
  }
}

export
default Level;
