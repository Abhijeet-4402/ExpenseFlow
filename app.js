let gameCanvas = document.querySelector('canvas');
let gfx = gameCanvas.getContext('2d');

let TILE = 35;
let WIDTH = 1000;
let HEIGHT = 600;

gameCanvas.width = WIDTH;
gameCanvas.height = HEIGHT;

let snake = [[0, 0]];
let dir = 'right';
let food = spawnFood();
let ended = false;
let points = 0;

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && dir !== 'right') {
        dir = 'left';
    } else if (e.key === 'ArrowUp' && dir !== 'down') {
        dir = 'up';
    } else if (e.key === 'ArrowDown' && dir !== 'up') {
        dir = 'down';
    } else if (e.key === 'ArrowRight' && dir !== 'left') {
        dir = 'right';
    }
});

function render() {
    if (ended === true) {
        clearInterval(loopId);
        gfx.fillStyle = 'red';
        gfx.font = '50px sans-serif';

        const text = 'Game Over!!';
        const textWidth = gfx.measureText(text).width;
        const x = (WIDTH - textWidth) / 2;
        const y = HEIGHT / 2;

        gfx.fillText(text, x, y);
        return;
    }

    gfx.fillStyle = '#a4c91dd3';
    gfx.fillRect(0, 0, WIDTH, HEIGHT);

    snake.forEach(function (segment, i) {
        const sx = segment[0];
        const sy = segment[1];

        if (i === snake.length - 1) {
            gfx.fillStyle = "#4e13d6f5";
            roundBox(sx, sy, TILE, TILE, 10);
            gfx.strokeStyle = "crimson";
            gfx.lineWidth = 2;
            gfx.strokeRect(sx, sy, TILE, TILE);
            drawEyes(sx, sy);
        } else {
            gfx.fillStyle = "blue";
            roundBox(sx, sy, TILE, TILE, 10);
            gfx.strokeStyle = "crimson";
            gfx.lineWidth = 2;
            gfx.strokeRect(sx, sy, TILE, TILE);
        }
    });

    gfx.fillStyle = "red";
    roundBox(food[0], food[1], TILE, TILE, 10);

    gfx.font = '22px cursive';
    gfx.fillStyle = 'red';
    gfx.fillText(`Score: ${points}`, 30, 30);
}

function roundBox(x, y, width, height, radius) {
    gfx.beginPath();
    gfx.moveTo(x + radius, y);
    gfx.arcTo(x + width, y, x + width, y + height, radius);
    gfx.arcTo(x + width, y + height, x, y + height, radius);
    gfx.arcTo(x, y + height, x, y, radius);
    gfx.arcTo(x, y, x + width, y, radius);
    gfx.closePath();
    gfx.fill();
}

function drawEyes(x, y) {
    gfx.beginPath();
    gfx.ellipse(x + TILE / 4, y + TILE / 4, 8, 12, -0.4, 0, 2 * Math.PI);
    gfx.fillStyle = 'white';
    gfx.fill();

    gfx.beginPath();
    gfx.ellipse(x + (TILE * 3) / 4, y + TILE / 4, 8, 12, 0.4, 0, 2 * Math.PI);
    gfx.fillStyle = 'white';
    gfx.fill();

    gfx.beginPath();
    gfx.ellipse(x + TILE / 4, y + TILE / 4 + 2, 4, 6, -0.4, 0, 2 * Math.PI);
    gfx.fillStyle = 'black';
    gfx.fill();

    gfx.beginPath();
    gfx.ellipse(x + (TILE * 3) / 4, y + TILE / 4 + 2, 4, 6, 0.4, 0, 2 * Math.PI);
    gfx.fillStyle = 'black';
    gfx.fill();
}

function step() {
    let hx = snake[snake.length - 1][0];
    let hy = snake[snake.length - 1][1];

    let nx;
    let ny;

    if (dir === 'left') {
        nx = hx - TILE;
        ny = hy;
    } else if (dir === 'up') {
        nx = hx;
        ny = hy - TILE;
    } else if (dir === 'down') {
        nx = hx;
        ny = hy + TILE;
    } else if (dir === 'right') {
        nx = hx + TILE;
        ny = hy;
    }

    if (nx < 0 || ny < 0 || nx >= WIDTH || ny >= HEIGHT) {
        ended = true;
        return;
    }

    if (intersects(nx, ny)) {
        ended = true;
        return;
    }

    snake.push([nx, ny]);

    if (nx === food[0] && ny === food[1]) {
        food = spawnFood();
        points += 1;
    } else {
        snake.shift();
    }
}

function spawnFood() {
    return [
        Math.round((Math.random() * (WIDTH - TILE)) / TILE) * TILE,
        Math.round((Math.random() * (HEIGHT - TILE)) / TILE) * TILE
    ];
}

function intersects(px, py) {
    for (let s of snake) {
        if (s[0] === px && s[1] === py) {
            return true;
        }
    }
    return false;
}

let loopId = setInterval(function () {
    step();
    render();
}, 150);
