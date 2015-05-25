/*
SoundManager
*/

export default class SoundManager extends Phaser.SoundManager {
  play(key, volume, loop) {
    if (!this.game.device.webAudio) {
      return this.playMedia(key, volume, loop);
    }

    return super.play(key, volume, loop);
  }

  playMedia(key, volume = 1, loop = false) {
    if (!window.Media) {
      console.log('[Media] need cordova-plugin-media to play');
      return;
    }

    let data = this.game.cache.getSoundData(key);

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
}
