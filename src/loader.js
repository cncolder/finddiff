/*
Loader
  Handle audio load. Only load once.
*/

export default class Loader extends Phaser.Loader {
  image(key, url, overwrite = true) {
    super.image(key, url, overwrite);

    return this;
  }

  audio(key, urls, autoDecode) {
    // if (this.game.cache.checkSoundKey(key)) {
      // return this;
    // } else if (!this.game.device.webAudio) {
      return this.media(key, urls);
    // }

    // super.audio(key, urls, autoDecode);

    // return this;
  }

  // load media if without web audio.
  media(key, path) {
    console.log('[Media]', 'cache', `${key} (${path})`);

    this.game.cache.addSound(key, '', {
      path,
    }, false, false);

    return this;
  }
}

// Phaser.Loader = Loader;
