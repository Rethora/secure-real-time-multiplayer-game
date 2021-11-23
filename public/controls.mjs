const controls = (player, socket) => {
    const getKey = key => {
        if (key === 'w' || key === 'ArrowUp') return 'up';
        if (key === 's' || key === 'ArrowDown') return 'down';
        if (key === 'a' || key === 'ArrowLeft') return 'left';
        if (key === 'd' || key === 'ArrowRight') return 'right';
    }

    let keymap = {};
    document.onkeyup = document.onkeydown = (e) => {
        // if I can get this to keep firing on keyup consistently
        // controls with be smoother
        const dir = getKey(e.key);
        if (dir) keymap[dir] = e.type === 'keydown';
        player.move(keymap);
        socket.emit('move-player', player.id, player.x, player.y);
    }
}

export default controls;
