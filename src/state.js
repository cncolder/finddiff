/*
State
  game state base class.
*/

import throttle from 'lodash/function/throttle';

let renderFpsThrottle;

class State extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    this.game.fitScreen();

    // remove camera bounds for slide.
    if (this.camera.bounds) {
      this.camera.bounds = null;
    }

    if (!this.load.onFileComplete.has(this.onFileComplete, this)) {
      this.load.onFileComplete.add(this.onFileComplete, this);
    }

    this.moveCallbackIndex = this.input.addMoveCallback(this.onMove, this);

    if (!this.input.onUp.has(this.onUp, this)) {
      this.input.onUp.add(this.onUp, this);
    }
  }

  // render() {
  //   if (
  //     this.game.env != 'production' &&
  //     this.game.enableDebug &&
  //     !this.game.paused &&
  //     !this.game.device.cocoonJSApp // CocoonJS lancher show fps itself.
  //   ) {
  //     this.renderFps();
  //   }
  // }

  shutdown() {
    this.load.onFileComplete.remove(this.onFileComplete, this);
    this.input.deleteMoveCallback(this.moveCallbackIndex);
    this.input.onUp.remove(this.onUp, this);
  }

  // min finger tip size. 44 is for 480*320 screen.
  // Give tappable controls a hit target of about 44 x 44 points. https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/LayoutandAppearance.html
  get inputCircle() {
    return new Phaser.Circle(0, 0, 44 / 480 * this.world.width);
  }

  // iPad status bar height is 20px;
  // http://forums.macrumors.com/showthread.php?t=937836
  get iPadStatusBarHeight() {
    return 20;
  }

  get differenceImageHeight() {
    return 576;
  }

  get iPadTop() {
    return (this.world.height - this.differenceImageHeight) / 2;
  }

  get iPadBottom() {
    return this.iPadTop + this.differenceImageHeight;
  }

  renderFps() {
    if (!renderFpsThrottle) {
      let renderFps = () => {
        let fps = this.game.time.fps;
        let x = this.game.device.iPad ? 50 : 0;

        if (!this.time.advancedTiming) {
          this.time.advancedTiming = true;
        }

        this.game.debug.text(fps, x, 14);
      };

      renderFpsThrottle = throttle(renderFps, 500);
    }

    renderFpsThrottle();
  }

  // show assets load progress bar. (progress, key, success, loaded, total)
  onFileComplete(progress) {
    if (!this.progress) {
      let y = this.game.device.iPad ? this.world.height : 0;
      let bar = this.add.graphics(0, y);
      let fontSize = this.world.height / 50;
      let text = this.add.text(this.world.centerX, fontSize, '', {
        align: 'center',
        font: 'Arial',
        fontWeight: 'bold',
        fontSize,
      });

      text.anchor.setTo(0.5);

      this.progress = {
        bar, text,
      };
    }

    this.progress.bar.lineStyle(this.height / 50, 0x00aa00);
    this.progress.bar.lineTo(this.world.width * progress / 100, 0);
    // this.progress.text.text = `${key} (${loaded}/${total})`;

    if (progress >= 100) {
      this.progress.bar.destroy();
      this.progress.text.destroy();

      delete this.progress;
    }
  }

  onUp() {
    if (this.camera.x < -this.world.centerX / 2) {
      this.game.previous();
    } else if (this.camera.x > this.world.centerX / 2) {
      this.game.next();
    } else if (this.camera.x !== 0) {
      this.add.tween(this.camera)
        .to({
          x: 0,
        }, 100, Phaser.Easing.Quadratic.InOut, true);
    }
  }

  // slide camera left or right. down is first time.
  onMove(pointer, x, y, down) {
    if (
      pointer.isDown && !down &&
      (
        Math.abs(x - pointer.positionDown.x) > this.inputCircle.radius ||
        !pointer.justPressed()
      )
    ) {
      // BUGFIX On iOS right landscape. Press then drag right out of screen(Power side). onUp event will not fire.
      if (x > this.camera.width - this.camera.width / 100) {
        this.onUp();
      } else {
        this.camera.x = pointer.positionDown.x - x;
      }
    }
  }
}

export default State;
