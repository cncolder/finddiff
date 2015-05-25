import shader from './bacteria.shader';

export default class SeabedFilter extends Phaser.Filter {
  constructor(game, uniforms) {
    super(game, uniforms, [shader]);
  }

  init() {
    super.init();

    // let {
    //   width, height
    // } = this.game.world;
    //
    // this.setResolution(width, height);
  }
}
