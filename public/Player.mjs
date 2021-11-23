import { canvasCalcs } from "./canvas-data.mjs";

class Player {
  constructor({ x, y, score = 0, id, isMain = false }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.isMain = isMain;
  }

  move(keymap) {
    for (const [key, value] of Object.entries(keymap)) {
      if (value) this.movePlayer(key);
    }
  }

  movePlayer(dir, speed = 5) {
    if (dir === 'up') this.y - speed >= canvasCalcs.playFieldMinY ? this.y -= speed : this.y;
    if (dir === 'down') this.y + speed <= canvasCalcs.playFieldMaxY ? this.y += speed : this.y;
    if (dir === 'right') this.x + speed <= canvasCalcs.playFieldMaxX ? this.x += speed : this.x;
    if (dir === 'left') this.x - speed >= canvasCalcs.playFieldMinX ? this.x -= speed : this.x;
  }

  collision(item) {
    const trans = 10;
    const range = 15;
    if (
      this.x + trans >= item.x - range &&
      this.x + trans <= item.x + range + 5 &&
      this.y + trans >= item.y - range &&
      this.y + trans <= item.y + range + 5
    ) return true;
    return false;
  }

  calculateRank(players) {
    const scores = players.map(p => p.score);
    const sorted = scores.sort((a, b) => b - a);
    const place = sorted.lastIndexOf(this.score) + 1;
    return `Rank: ${place} / ${scores.length}`;
  }

  drawToCanvas(context, imgs) {
    let img;
    if (this.isMain) {
      img = imgs.main;
    }
    else {
      img = imgs.opponent;
    }
    context.drawImage(img, this.x, this.y);
  }
}

try {
  module.exports = Player;
} catch (e) { }

export default Player;