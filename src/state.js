/*
State
  game state base class.
*/

class State extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    super.init();

    this.game.fitScreen();
  }

  preload() {
    this.load.onFileComplete.add(this.onFileComplete, this);

    this.loadImage('previous', 'asset/previous.png');
    this.loadImage('next', 'asset/next.png');
    // this.load.image('sound', 'asset/sound.png');
  }

  create() {
    super.create();
  }

  update() {}

  render() {
    // if (this.env == 'development' && !navigator.isCocoonJS) {
    this.renderFps();
    this.renderErrors();
    // }
  }

  shutdown() {
    this.load.onFileComplete.remove(this.onFileComplete, this);
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
        console.log('[Media]', 'cache', `${key} (${path})`);

        this.cache.addSound(key, '', {
          path,
        });
      } else {
        this.load.audio(key, path);
      }
    }
  }

  playAudio(key, volume = 1, loop = false) {
    let device = this.game.device;

    if (device.android && !device.webAudio) {
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
    } else {
      return this.sound.play(key, volume, loop);
    }
  }

  renderFps() {
    if (this.game.paused) {
      return;
    }
    
    if (!this.time.advancedTiming) {
      this.time.advancedTiming = true;
    }

    let fps = this.game.time.fps;

    this.game.debug.text(`fps:${fps}`, 0, 12);
  }

  renderErrors() {
    if (this.game.errors && !this.game.paused) {
      let err = this.game.errors.join('\n').substr(0, 100);

      this.game.debug.text(err, 0, 32);
    }
  }

  onFileComplete(progress, key, success, loaded, total) {
    if (!this.progress) {
      let bar = this.add.graphics(0, 0);
      let text = this.add.text(this.world.centerX, 20, '', {
        align: 'center',
        font: 'Arial',
        fontWeight: 'bold',
        fontSize: 20,
      });

      text.anchor.setTo(0.5);

      this.progress = {
        bar, text,
      };
    }

    this.progress.bar.lineStyle(10, 0x00cc00);
    this.progress.bar.lineTo(this.world.width * progress / 100, 0);
    this.progress.text.text = `${key} (${loaded}/${total})`;

    if (progress >= 100) {
      this.progress.bar.clear();
      this.progress.text.text = '';
    }
  }
}

export default State;
