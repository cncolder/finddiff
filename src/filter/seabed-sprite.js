import SeabedFilter from './seabed-filter';

export default class SeabedSprite extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame);

    this.width = game.world.width;
    this.height = game.world.height;
    this.filters = [new SeabedFilter(game)];
  }
}
