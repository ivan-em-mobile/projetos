document.addEventListener("DOMContentLoaded", () => {
  // Game constants
  const COLS = 10;
  const ROWS = 20;
  const BLOCK_SIZE = 30;
  const EMPTY = "empty";

  // Game variables
  let board = createEmptyBoard();
  let currentPiece = null;
  let nextPiece = null;
  let currentPosition = { x: 0, y: 0 };
  let score = 0;
  let level = 1;
  let lines = 0;
  let gameInterval = null;
  let gameSpeed = 1000;
  let isPaused = false;
  let gameOver = true;

  // DOM elements
  const gameBoard = document.getElementById("game-board");
  const nextPieceGrid = document.getElementById("next-piece-grid");
  const scoreDisplay = document.getElementById("score");
  const levelDisplay = document.getElementById("level");
  const linesDisplay = document.getElementById("lines");
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const gameOverModal = document.getElementById("game-over-modal");
  const finalScoreDisplay = document.getElementById("final-score");
  const restartBtn = document.getElementById("restart-btn");

  // Tetromino shapes
  const SHAPES = {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  };

  const COLORS = {
    I: "tetromino-I",
    J: "tetromino-J",
    L: "tetromino-L",
    O: "tetromino-O",
    S: "tetromino-S",
    T: "tetromino-T",
    Z: "tetromino-Z",
  };

  // Initialize the game board
  function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
  }

  function drawBoard() {
    gameBoard.innerHTML = "";

    // Draw the board
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        if (board[y][x] !== EMPTY) {
          cell.classList.add(board[y][x]);
        } else {
          cell.classList.add("bg-gray-700");
        }

        gameBoard.appendChild(cell);
      }
    }

    // Draw the current piece (if it exists)
    if (currentPiece) {
      drawPiece(currentPiece, currentPosition, false);

      // Draw ghost piece
      const ghostPosition = getGhostPosition();
      drawPiece(currentPiece, ghostPosition, true);
    }
  }

  function drawPiece(piece, position, isGhost) {
    const pieceMatrix = rotateMatrix(SHAPES[piece.type], piece.rotation);
    const colorClass = COLORS[piece.type];

    for (let y = 0; y < pieceMatrix.length; y++) {
      for (let x = 0; x < pieceMatrix[y].length; x++) {
        if (pieceMatrix[y][x]) {
          const boardX = position.x + x;
          const boardY = position.y + y;

          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            const index = boardY * COLS + boardX;
            if (index >= 0 && index < gameBoard.children.length) {
              const cell = gameBoard.children[index];

              if (isGhost) {
                cell.classList.add(colorClass, "ghost-piece");
              } else {
                cell.classList.add(colorClass);
              }
            }
          }
        }
      }
    }
  }

  function drawNextPiece() {
    nextPieceGrid.innerHTML = "";

    if (!nextPiece) return;

    const pieceMatrix = SHAPES[nextPiece.type];

    // Center the piece in the 4x4 grid
    const offsetX = Math.floor((4 - pieceMatrix[0].length) / 2);
    const offsetY = Math.floor((4 - pieceMatrix.length) / 2);

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const cell = document.createElement("div");
        cell.className = "w-6 h-6";

        const pieceX = x - offsetX;
        const pieceY = y - offsetY;

        if (
          pieceY >= 0 &&
          pieceY < pieceMatrix.length &&
          pieceX >= 0 &&
          pieceX < pieceMatrix[0].length &&
          pieceMatrix[pieceY][pieceX]
        ) {
          cell.classList.add(COLORS[nextPiece.type]);
        } else {
          cell.classList.add("bg-gray-800");
        }

        nextPieceGrid.appendChild(cell);
      }
    }
  }

  function getRandomPiece() {
    const pieces = Object.keys(SHAPES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return { type: randomPiece, rotation: 0 };
  }

  function spawnPiece() {
    currentPiece = nextPiece || getRandomPiece();
    nextPiece = getRandomPiece();

    // Calculate starting position (centered horizontally)
    const pieceMatrix = SHAPES[currentPiece.type];
    currentPosition = {
      x: Math.floor(COLS / 2) - Math.floor(pieceMatrix[0].length / 2),
      y: 0,
    };

    // Check if game over (collision at spawn)
    if (checkCollision(currentPiece, currentPosition)) {
      endGame();
      return false;
    }

    drawNextPiece();
    return true;
  }

  function rotatePiece() {
    if (!currentPiece || isPaused || gameOver) return;

    const originalRotation = currentPiece.rotation;
    currentPiece.rotation = (currentPiece.rotation + 1) % 4;

    // Check if rotation causes collision
    if (checkCollision(currentPiece, currentPosition)) {
      // Try wall kicks (move left/right to find a valid position)
      const kicks = [-1, 1, -2, 2];
      for (const kick of kicks) {
        const newPosition = { ...currentPosition, x: currentPosition.x + kick };
        if (!checkCollision(currentPiece, newPosition)) {
          currentPosition.x = newPosition.x;
          drawBoard();
          return;
        }
      }

      // If no valid position found, revert rotation
      currentPiece.rotation = originalRotation;
    }

    drawBoard();
  }

  function rotateMatrix(matrix, rotation) {
    if (rotation === 0) return matrix;

    // Deep copy the matrix
    let newMatrix = JSON.parse(JSON.stringify(matrix));

    // Rotate 90 degrees clockwise for each rotation
    for (let r = 0; r < rotation; r++) {
      newMatrix = newMatrix[0].map((_, i) =>
        newMatrix.map((row) => row[row.length - 1 - i])
      );
    }

    return newMatrix;
  }

  function movePiece(direction) {
    if (!currentPiece || isPaused || gameOver) return false;

    const newPosition = { ...currentPosition };

    switch (direction) {
      case "left":
        newPosition.x--;
        break;
      case "right":
        newPosition.x++;
        break;
      case "down":
        newPosition.y++;
        break;
    }

    if (!checkCollision(currentPiece, newPosition)) {
      currentPosition = newPosition;
      drawBoard();

      if (direction === "down") {
        return false; // Piece is still falling
      }
      return true; // Piece moved successfully
    } else if (direction === "down") {
      // Piece has landed
      lockPiece();
      return true; // Piece landed
    }

    return false; // Move not possible
  }

  function getGhostPosition() {
    if (!currentPiece) return { x: 0, y: 0 };

    let ghostY = currentPosition.y;
    while (
      !checkCollision(currentPiece, { x: currentPosition.x, y: ghostY + 1 })
    ) {
      ghostY++;
    }

    return { x: currentPosition.x, y: ghostY };
  }

  function checkCollision(piece, position) {
    const pieceMatrix = rotateMatrix(SHAPES[piece.type], piece.rotation);

    for (let y = 0; y < pieceMatrix.length; y++) {
      for (let x = 0; x < pieceMatrix[y].length; x++) {
        if (pieceMatrix[y][x]) {
          const boardX = position.x + x;
          const boardY = position.y + y;

          if (
            boardX < 0 ||
            boardX >= COLS ||
            boardY >= ROWS ||
            (boardY >= 0 && board[boardY][boardX] !== EMPTY)
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  function lockPiece() {
    const pieceMatrix = rotateMatrix(
      SHAPES[currentPiece.type],
      currentPiece.rotation
    );

    for (let y = 0; y < pieceMatrix.length; y++) {
      for (let x = 0; x < pieceMatrix[y].length; x++) {
        if (pieceMatrix[y][x]) {
          const boardX = currentPosition.x + x;
          const boardY = currentPosition.y + y;

          if (boardY >= 0 && boardX >= 0 && boardX < COLS && boardY < ROWS) {
            board[boardY][boardX] = COLORS[currentPiece.type];
          }
        }
      }
    }

    // Check for completed lines
    checkLines();

    // Spawn new piece
    if (!spawnPiece()) {
      return;
    }

    drawBoard();
  }

  function checkLines() {
    let linesCleared = 0;

    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every((cell) => cell !== EMPTY)) {
        // Remove the line
        board.splice(y, 1);
        // Add new empty line at the top
        board.unshift(Array(COLS).fill(EMPTY));
        linesCleared++;
        y++; // Check the same row again since we moved everything down
      }
    }

    if (linesCleared > 0) {
      updateScore(linesCleared);
      lines += linesCleared;
      linesDisplay.textContent = lines;

      // Flash animation for cleared lines
      const linesToFlash = [];
      for (let y = 0; y < ROWS; y++) {
        if (board[y].every((cell) => cell !== EMPTY)) {
          linesToFlash.push(y);
        }
      }

      if (linesToFlash.length > 0) {
        flashLines(linesToFlash);
      }
    }
  }

  function flashLines(lines) {
    const cellsToFlash = [];

    for (const y of lines) {
      for (let x = 0; x < COLS; x++) {
        const index = y * COLS + x;
        cellsToFlash.push(gameBoard.children[index]);
      }
    }

    cellsToFlash.forEach((cell) => {
      cell.classList.add("flash-animation", "bg-white");
    });

    setTimeout(() => {
      cellsToFlash.forEach((cell) => {
        cell.classList.remove("flash-animation", "bg-white");
      });
      drawBoard();
    }, 500);
  }

  function updateScore(linesCleared) {
    const points = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 lines
    score += points[linesCleared] * level;
    scoreDisplay.textContent = score;

    // Level up every 10 lines
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
      level = newLevel;
      levelDisplay.textContent = level;

      // Increase game speed (cap at level 20)
      gameSpeed = Math.max(100, 1000 - (level - 1) * 50);

      if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
      }
    }
  }

  function dropPiece() {
    levelDisplay.textContent = level;
    linesDisplay.textContent = lines;

    // Hide game over modal
    gameOverModal.classList.add("hidden");

    // Show pause button, hide start button
    startBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
    pauseBtn.textContent = "Pause";

    // Spawn first pieces
    nextPiece = getRandomPiece();
    spawnPiece();

    // Start game loop
    gameSpeed = 1000;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);

    drawBoard();
    drawNextPiece();
  }

  function pauseGame() {
    if (gameOver) return;

    isPaused = !isPaused;

    if (isPaused) {
      pauseBtn.textContent = "Resume";
      clearInterval(gameInterval);
    } else {
      pauseBtn.textContent = "Pause";
      gameInterval = setInterval(gameLoop, gameSpeed);
    }
  }

  function endGame() {
    gameOver = true;
    clearInterval(gameInterval);

    // Show game over modal
    finalScoreDisplay.textContent = score;
    gameOverModal.classList.remove("hidden");

    // Show start button, hide pause button
    startBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
  }

  // Event listeners
  startBtn.addEventListener("click", startGame);
  pauseBtn.addEventListener("click", pauseGame);
  restartBtn.addEventListener("click", startGame);

  document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    switch (e.key) {
      case "ArrowLeft":
        movePiece("left");
        break;
      case "ArrowRight":
        movePiece("right");
        break;
      case "ArrowDown":
        movePiece("down");
        break;
      case "ArrowUp":
        rotatePiece();
        break;
      case " ":
        dropPiece();
        break;
      case "p":
      case "P":
        pauseGame();
        break;
    }
    // Prevent default for arrow keys and space
    if (
      ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)
    ) {
      e.preventDefault();
    }
  });

  // Initialize the board
  drawBoard();
  drawNextPiece();
});
