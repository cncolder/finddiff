/*
SoundManager
*/

export default class SoundManager extends Phaser.SoundManager {
  play(key, volume, loop) {
    // if (!this.game.device.webAudio) {
      return this.playMedia(key, volume, loop);
    // }

    // return super.play(key, volume, loop);
  }

  playMedia(key, volume = 1, loop = false) {
    if (!window.Media) {
      console.log('[Media] need cordova-plugin-media to play');
      return;
    }

    let data = this.game.cache.getSoundData(key);
    let path = data.path;

    if (this.game.device.android) {
      // 10 is the length of 'index.html'
      let root = location.href.substr(0, location.href.length - 10);

      // file:///android_asset/www/asset/xxx.mp3
      path = root + path;
    }

    let media = new Media(path, () => {
      media.isPlaying = false;

      if (!this.game.paused) {
        if (loop) {
          media.play();
        } else {
          // media.release();
        }
      }
    }, err => {
      console.log('[Media]', 'error', err.message);
    }, status => {
      media.isPlaying =
        status == Media.MEDIA_STARTING ||
        status == Media.MEDIA_RUNNING;
    });

    media.setVolume(volume);

    // https://issues.apache.org/jira/browse/CB-7599?focusedCommentId=14374824&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-14374824
    // setTimeout(() => media.stop(), (media.getDuration() * 1000 - 100));

    media.play({
      playAudioWhenScreenIsLocked: false, // iOS only
    });

    media.resume = media.play.bind(media);

    return media;
  }
}
