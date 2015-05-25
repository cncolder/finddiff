/*
Ending
  the ending of magic seabed world.
*/

import Seabed from './seabed';
// import SeabedSprite from './filter/seabed-sprite';
import SeabedFilter from './filter/seabed-filter.js';

export default class Ending extends Seabed {
  constructor() {
    super();
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    let text = this.add.text(this.world.centerX, this.world.centerY, {
      align: 'center',
      font: 'Arial',
      fontWeight: 'bold',
      fontSize: 120,
    });
    text.anchor.setTo(0.5, 0.5);
    text.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 10);
    text.text = '任务完成! Mission Complete!';

    let grd = text.context.createLinearGradient(0, 0, 0, text.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    // let y = this.game.device.iPad ? 20 : 0;
    //
    // let sprite = this.sprite = this.add.sprite(0, y);
    //
    // sprite.width = this.world.width;
    // sprite.height = this.world.height - y;
    // sprite.filters = [new SeabedFilter(this.game)];
  }

  update() {
    super.update();

    // this.sprite.filters[0].update();
  }

  shutdown() {
    super.shutdown();
  }
}
