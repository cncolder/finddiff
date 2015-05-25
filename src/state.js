/*
State
  game state base class.
*/

import throttle from 'lodash/function/throttle';

class State extends Phaser.State {
  constructor() {
    super();
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

  init() {
    this.game.fitScreen();

    // remove camera bounds for slide.
    this.camera.bounds = null;

    if (!this.load.onFileComplete.has(this.onFileComplete, this)) {
      this.load.onFileComplete.add(this.onFileComplete, this);
    }

    this.moveCallbackIndex = this.input.addMoveCallback(this.onMove, this);

    if (!this.input.onUp.has(this.onUp, this)) {
      this.input.onUp.add(this.onUp, this);
    }
  }

  render() {
    if (!this.game.paused && !this.game.device.cocoonJSApp) {
      this.renderFps();
    }
  }

  shutdown() {
    this.load.onFileComplete.remove(this.onFileComplete, this);
    this.input.deleteMoveCallback(this.moveCallbackIndex);
    this.input.onUp.remove(this.onUp, this);
  }

  get env() {
    return this.game.env;
  }

  assign(obj) {
    Object.assign(this, obj);
  }

  loadImage(key, path) {
    if (!this.cache.checkImageKey(key)) {
      this.load.image(key, path);
    }
  }

  loadAudio(key, path) {
    if (!this.cache.checkSoundKey(key)) {
      let device = this.game.device;

      if (device.android && !device.webAudio) {
        return this.loadMedia(key, path);
      }

      this.load.audio(key, path, false);
    }
  }

  loadMedia(key, path) {
    console.log('[Media]', 'cache', `${key} (${path})`);

    this.cache.addSound(key, '', {
      path,
    });
  }

  playAudio(key, volume = 1, loop = false) {
    let device = this.game.device;

    if (device.android && !device.webAudio) {
      return this.playMedia(key, volume, loop);
    } else {
      return this.sound.play(key, volume, loop);
    }
  }

  playMedia(key, volume = 1, loop = false) {
    if (!window.Media) {
      console.log('[Media] need cordova-plugin-media to play');
      return;
    }

    let data = this.cache.getSoundData(key);

    // 10 is the length of 'index.html'
    let root = location.href.substr(0, location.href.length - 10);

    // file:///android_asset/www/asset/xxx.mp3
    let path = root + data.path;

    let media = new Media(path, () => {
      console.log('[Media]', 'finish', `${key} (${path})`);

      if (!this.game.paused) {
        if (loop) {
          console.log('[Media]', 'loop', `${key} (${path})`);

          media.play();
        } else {
          console.log('[Media]', 'release', `${key} (${path})`);

          media.release();
        }
      }
    }, err => {
      console.log('[Media]', 'error', err.message);
    });

    media.setVolume(volume);
    media.play();

    media.resume = media.play.bind(media);

    return media;
  }

  renderFps() {
    if (!this.time.advancedTiming) {
      this.time.advancedTiming = true;
    }

    if (!this.renderFpsThrottle) {
      let renderFps = () => {
        let fps = this.game.time.fps;
        let x = this.game.device.iPad ? 50 : 0;

        this.game.debug.text(fps, x, 14);
      };

      this.renderFpsThrottle = throttle(renderFps, 500);
    }

    this.renderFpsThrottle();
  }

  // progress, key, success, loaded, total
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
