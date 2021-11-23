import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { canvasCalcs, getRandomXY, getNewCollectible } from './canvas-data.mjs';
import controls from './controls.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const loadImage = src => {
    const img = new Image();
    img.src = src;
    return img;
}

const coinPics = {
    bronzeCoin: loadImage('../assets/bronze-coin.png'),
    silverCoin: loadImage('../assets/silver-coin.png'),
    goldCoin: loadImage('../assets/gold-coin.png')
};

const playerPics = {
    main: loadImage('../assets/main-player.png'),
    opponent: loadImage('../assets/other-player.png')
};

let playerId;
let currPlayers;
let currCollectible;

socket.on('init', ({ id, coll }) => {
    playerId = id;
    if (!coll) {
        coll = getNewCollectible();
        socket.emit('new-collectible', coll);
    }
    const [x, y] = getRandomXY();
    const player = new Player({
        x: x,
        y: y,
        id: id
    });
    controls(player, socket);
    socket.emit('new-player', player);
})

socket.on('update', ({ players, coll }) => {
    console.log(players, coll)
    currPlayers = players;
    currCollectible = coll;

    let currPlayer = new Player(currPlayers.find(p => p.id === playerId));
    if (currPlayer.collision(currCollectible)) {
        socket.emit('item-destroyed', currPlayer, currCollectible, getNewCollectible());
    }
    draw();
})

const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Set background color
    context.fillStyle = '#220';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create border for play field
    context.strokeStyle = 'white';
    context.strokeRect(canvasCalcs.playFieldMinX, canvasCalcs.playFieldMinY, canvasCalcs.playFieldWidth, canvasCalcs.playFieldHeight);

    // Controls text
    context.fillStyle = 'white';
    context.font = `13px 'Press Start 2P'`;
    context.textAlign = 'center';
    context.fillText('Controls: WASD', 100, 32.5);

    // Game title
    context.font = `16px 'Press Start 2P'`;
    context.fillText('Coin Grab', canvasCalcs.canvasWidth / 2, 32.5);

    if (currCollectible) {
        const collectible = new Collectible(currCollectible);
        collectible.drawToCanvas(context, coinPics);
    }

    if (currPlayers.length) {
        currPlayers.forEach(p => {
            const player = new Player(p);
            if (p.id === playerId) player.isMain = true;
            player.drawToCanvas(context, playerPics);
        });
        let currPlayer = new Player(currPlayers.find(p => p.id === playerId));
        context.font = `13px 'Press Start 2P'`;
        context.fillText(currPlayer.calculateRank(currPlayers), 560, 32.5);
    }

    requestAnimationFrame(draw);
}