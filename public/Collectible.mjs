class Collectible {
  constructor({ x, y, value, id }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
  }

  drawToCanvas(context, imgs) {
    let img;
    if (this.value === 1) {
      img = imgs.bronzeCoin;
    }
    else if (this.value === 2) {
      img = imgs.silverCoin;
    }
    else {
      img = imgs.goldCoin;
    }
    context.drawImage(img, this.x, this.y)
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) { }

export default Collectible;
