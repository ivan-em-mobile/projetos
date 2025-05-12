const canvas = document.getElementById('tetris-canvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const nextPieceCanvas = document.getElementById('next-piece-canvas');
const nextContext = nextPieceCanvas.getContext('2d');

const grid = [];
const gridRows = 20;
const gridCols = 10;
const blockSize = 20;

let currentPiece = null;
let nextPiece = null;
let gameInterval;
let gameSpeed = 1000;
let score = 0;
let level = 1;
let isPaused = false;

const colors = [
    null, 'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

const tetrominoes = [
    [],
    [[0, 0], [0, -1], [0, 1], [0, 2]],
    [[0, 0], [-1, 0], [1, 0], [-1, -1]],
    [[0, 0], [-1, 0], [1, 0], [1, -1]],
    [[0, 0], [-1, -1], [0, -1], [1, 0]],
    [[0, 0], [-1, 0], [0, -1], [1, 0]],
    [[0, 0], [-1, 0], [0, -1], [-1, -1]],
    [[0, 0], [-1, 0], [0, -1], [-1, -1]] // Correção: Formato do O
];

function createGrid() {
    for (let y = 0; y < gridRows; y++) {
        grid[y] = [];
        for (let x = 0; x < gridCols; x++) {
            grid[y][x] = 0;
        }
    }
}

function createPiece() {
    const type = Math.floor(Math.random() * (tetrominoes.length - 1)) + 1;
    return {
        type: type,
        shape: tetrominoes[type],
        x: Math.floor(gridCols / 2) - Math.ceil(tetrominoes[type].reduce((max, block) => Math.max(max, block[0]), 0) / 2),
        y: 0,
        rotation: 0
    };
}

function drawBlock(context, x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    context.strokeStyle = '#000';
    context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawGrid() {
    grid.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(context, x, y, colors[value]);
            }
        });
    });
}

function drawPiece() {
    if (currentPiece) {
        currentPiece.shape.forEach(block => {
            drawBlock(context, currentPiece.x + block[0], currentPiece.y + block[1], colors[currentPiece.type]);
        });
    }
}

function drawNextPiece() {
    nextContext.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    if (nextPiece) {
        nextPiece.shape.forEach(block => {
            nextContext.fillStyle = colors[nextPiece.type];
            nextContext.fillRect((nextPieceCanvas.width / 2) + (block[0] * blockSize / 2) - (blockSize / 2),
                             (nextPieceCanvas.height / 2) + (block[1] * blockSize / 2) - (blockSize / 2),
                             blockSize / 2, blockSize / 2);
            nextContext.strokeStyle = '#000';
            nextContext.strokeRect((nextPieceCanvas.width / 2) + (block[0] * blockSize / 2) - (blockSize / 2),
                              (nextPieceCanvas.height / 2) + (block[1] * blockSize / 2) - (blockSize / 2),
                              blockSize / 2, blockSize / 2);
        });
    }
}

function collide(piece) {
    const [shape, offsetX, offsetY] = [piece.shape, piece.x, piece.y];
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const newX = offsetX + shape[x][0];
                const newY = offsetY + shape[x][1];
                if (newY >= gridRows || newX < 0 || newX >= gridCols || (grid[newY] && grid[newY][newX]) !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergePiece() {
    currentPiece.shape.forEach(block => {
        grid[currentPiece.y + block[1]][currentPiece.x + block[0]] = currentPiece.type;
    });
}

function sweepLines() {
    let linesCleared = 0;
    for (let y = gridRows - 1; y >= 0; y--) {
        if (grid[y].every(value => value !== 0)) {
            linesCleared++;
            grid.splice(y, 1);
            grid.unshift(Array(gridCols).fill(0));
        }
    }
    updateScore(linesCleared);
}

function movePieceDown() {
    currentPiece.y++;
    if (collide(currentPiece)) {
        currentPiece.y--;
        mergePiece();
        currentPiece = nextPiece;
        nextPiece = createPiece();
        drawNextPiece();
        sweepLines();
        // Removida a chamada recursiva incorreta aqui:
        if (collide(currentPiece)) {
            gameOver();
        }
    }
}

function movePieceLeft() {
    currentPiece.x--;
    if (collide(currentPiece)) {
        currentPiece.x++;
    }
}

function movePieceRight() {
    currentPiece.x++;
    if (collide(currentPiece)) {
        currentPiece.x--;
    }
}

function rotatePiece() {
    const shape = currentPiece.shape;
    const newShape = shape[0].map((val, index) => shape.map(row => row[index]).reverse());
    const originalX = currentPiece.x;
    currentPiece.shape = newShape;
    while (collide(currentPiece)) {
        currentPiece.x--;
        if (collide(currentPiece)) {
            currentPiece.x = originalX;
            currentPiece.shape = shape;
            return;
        }
    }
}

function dropPiece() {
    while (!collide(currentPiece)) {
        currentPiece.y++;
    }
    currentPiece.y--;
    movePieceDown();
}

function updateScore(lines) {
    score += lines * lines * 100;
    scoreElement.innerText = score.toString().padStart(5, '0');
    if (score >= level * 1000) {
        level++;
        levelElement.innerText = level;
        gameSpeed *= 0.8;
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, gameSpeed);
    }
}

function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Sua pontuação foi: ${score}`);
    createGrid();
    currentPiece = null;
    nextPiece = createPiece();
    drawNextPiece();
    score = 0;
    level = 1;
    scoreElement.innerText = '00000';
    levelElement.innerText = '1';
    startGame();
}

function drawPauseScreen() {
    context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    context.fillRect(0, canvas.height / 4, canvas.width, canvas.height / 2);
    context.font = '24px sans-serif';
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.fillText('PAUSADO', canvas.width / 2, canvas.height / 2);
}

function updateGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    if (!isPaused) {
        drawPiece();
        movePieceDown();
    } else {
        drawPauseScreen();
    }
}

function startGame() {
    createGrid();
    currentPiece = createPiece();
    nextPiece = createPiece();
    drawNextPiece();
    gameSpeed = 1000;
    score = 0;
    level = 1;
    scoreElement.innerText = '00000';
    levelElement.innerText = '1';
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, gameSpeed);
    isPaused = false;
}

document.addEventListener('keydown', event => {
    if (!currentPiece) return;
    switch (event.key) {
        case 'ArrowLeft':
            movePieceLeft();
            break;
        case 'ArrowRight':
            movePieceRight();
            break;
        case 'ArrowDown':
            movePieceDown();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case ' ':
            dropPiece();
            break;
        case 'p':
        case 'P':
            isPaused = !isPaused;
            break;
    }
});

startGame();