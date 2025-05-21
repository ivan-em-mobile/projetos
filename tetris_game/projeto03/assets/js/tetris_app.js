// --- Início do código do jogo Tetris ---

// 1. Definições de Formas das Peças (com rotações)
// Cada peça é um array de padrões, representando suas rotações
const I = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
];

const J = [
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];

const L = [
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
];

const O = [
  [
    // A peça O só tem uma rotação
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
];

const S = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const T = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const Z = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
];

// Array que associa as formas das peças, suas cores e imagens
// As imagens devem estar em 'assets/images/'
const PIECES = [
  [Z, "red", "../z.png"],
  [S, "pink", "../s.png"],
  [T, "yellow", "../t.png"],
  [O, "blue", "../o.png"],
  [L, "purple", "../l.png"],
  [I, "cyan", "../i.png"],
  [J, "orange", "../j.png"],
];

// Mapeamento de velocidade para texto legível
const readableSpeed = {
  500: "SLOW",
  480: "2",
  460: "3",
  440: "4",
  420: "5",
  400: "6",
  380: "7",
  360: "8",
  340: "9",
  320: "10",
  300: "11",
  280: "12",
  260: "13",
  240: "14",
  220: "15",
  200: "16",
  180: "17",
  160: "18",
  140: "19",
  120: "20",
  100: "FULL SPEED",
};

// 2. Definições de Constantes e Variáveis de Jogo
const ROW = 19; // Número de linhas da grade
const COL = 10; // Número de colunas da grade
const SQ = 40; // Tamanho de cada quadrado em pixels
const defaultColor = "#111222"; // Cor padrão para células vazias do tabuleiro
const defaultBorderColor = "#444444"; // Cor da borda dos quadrados do tabuleiro

let isGameOver = false; // Estado do jogo: se terminou
let isHomeScreen = true; // Estado do jogo: se está na tela inicial
let isPaused = false; // Estado do jogo: se está pausado
let canMove = true; // Controla se a peça pode ser movida pelo jogador
let speed = 500; // Velocidade de queda da peça (ms)
let dropStart = Date.now(); // Timestamp da última queda
let score = 0; // Pontuação do jogador
let board = []; // A matriz que representa o tabuleiro do jogo
let piece; // A peça que está caindo atualmente
let nextPiece; // A próxima peça a cair

// 3. Referências aos Elementos HTML
const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d"); // Contexto 2D do canvas
const scoreElements = document.getElementsByClassName("score"); // Elementos para exibir a pontuação (pode ser mais de um)
const speedElement = document.getElementById("speed"); // Elemento para exibir a velocidade
const homeElement = document.getElementById("home"); // Elemento da tela inicial
const gameOverElement = document.getElementById("game-over"); // Elemento da tela de Game Over
const pauseElement = document.getElementById("pause-screen"); // Elemento da tela de pausa

const startBtn = document.getElementById("startBtn"); // Botão de iniciar jogo
const playAgainBtn = document.getElementById("playAgainBtn"); // Botão de jogar novamente
const quitBtn = document.getElementById("quitBtn"); // Botão de sair

// 4. Classe Piece (representa as peças do Tetris)
class Piece {
  constructor(piece, color, image) {
    this.piece = piece; // Array com as rotações da peça
    this.color = color; // Cor da peça
    this.image = image; // Nome do arquivo de imagem da peça para "próxima peça"

    this.pieceN = 0; // Índice da rotação atual (0 = primeira rotação)
    this.activePiece = this.piece[this.pieceN]; // A forma atual da peça
    // Posição inicial da peça (centralizada no topo do tabuleiro, um pouco acima)
    this.x = Math.floor(COL / 2) - Math.floor(this.activePiece[0].length / 2);
    this.y = -2;
  }

  // Preenche/Apaga os quadrados da peça com uma determinada cor
  fill(color) {
    for (
      let currentRow = 0;
      currentRow < this.activePiece.length;
      currentRow++
    ) {
      for (
        let currentCol = 0;
        currentCol < this.activePiece[currentRow].length;
        currentCol++
      ) {
        if (this.activePiece[currentRow][currentCol]) {
          // Se for parte da peça (valor 1)
          drawSquare(this.y + currentRow, this.x + currentCol, color);
        }
      }
    }
  }

  // Desenha a peça na sua cor
  draw() {
    this.fill(this.color);
  }

  // Apaga a peça, preenchendo seus quadrados com a cor de fundo padrão
  unDraw() {
    this.fill(defaultColor);
  }

  // Move a peça para a esquerda
  moveLeft() {
    if (this.collision(-1, 0, this.activePiece)) return; // Se houver colisão, não move
    this.unDraw();
    this.x--;
    this.draw();
  }

  // Move a peça para a direita
  moveRight() {
    if (this.collision(1, 0, this.activePiece)) return; // Se houver colisão, não move
    this.unDraw();
    this.x++;
    this.draw();
  }

  // Rotaciona a peça
  rotate() {
    // Calcula o próximo padrão de rotação
    const nextPattern = this.piece[(this.pieceN + 1) % this.piece.length];
    let kick = 0; // Offset para a rotação (kick wall)

    // Verifica se a rotação causaria colisão
    if (this.collision(0, 0, nextPattern)) {
      kick = 1; // Tenta mover a peça um quadrado para a direita
      if (this.x > COL / 2) kick = -1; // Se estiver na metade direita do tabuleiro, tenta mover para a esquerda
    }

    // Se a rotação não causar colisão (mesmo com kick)
    if (!this.collision(kick, 0, nextPattern)) {
      this.unDraw(); // Apaga a peça atual
      this.x += kick; // Aplica o kick
      this.pieceN = (this.pieceN + 1) % this.piece.length; // Atualiza o índice da rotação
      this.activePiece = this.piece[this.pieceN]; // Define a nova forma ativa
      this.draw(); // Desenha a peça rotacionada na nova posição
    }
  }

  // Move a peça para baixo (lógica principal de queda e fixação)
  moveDown() {
    if (!this.collision(0, 1, this.activePiece)) {
      // Se não houver colisão para baixo
      dropStart = Date.now(); // Reseta o timer de queda
      this.unDraw(); // Apaga a peça
      this.y++; // Move para baixo
      this.draw(); // Desenha na nova posição
    } else {
      // Se houver colisão (atingiu o fundo ou outra peça)
      this.lock(); // Fixa a peça no tabuleiro
      piece = nextPiece; // A peça atual se torna a próxima peça
      selectNextPiece(); // Seleciona uma nova "próxima peça"
    }
  }

  // Verifica colisão com as bordas do tabuleiro ou outras peças
  collision(xOffset, yOffset, futurePiece) {
    for (let currentRow = 0; currentRow < futurePiece.length; currentRow++) {
      for (
        let currentCol = 0;
        currentCol < futurePiece[currentRow].length;
        currentCol++
      ) {
        // Se a célula na futurePiece não for parte da peça (0), ignora
        if (!futurePiece[currentRow][currentCol]) continue;

        // Calcula a nova posição no tabuleiro
        const newX = this.x + currentCol + xOffset;
        const newY = this.y + currentRow + yOffset;

        // Verifica colisão com as bordas do tabuleiro
        if (newX < 0 || newX >= COL || newY >= ROW) return true;

        // Se a peça ainda está acima do tabuleiro (newY < 0), não há colisão com peças abaixo
        if (newY < 0) continue;

        // Verifica colisão com outras peças já fixadas no tabuleiro
        if (board[newY][newX] !== defaultColor) return true;
      }
    }
    return false; // Nenhuma colisão detectada
  }

  // Fixa a peça no tabuleiro (quando ela para de cair)
  lock() {
    for (
      let currentRow = 0;
      currentRow < this.activePiece.length;
      currentRow++
    ) {
      for (
        let currentCol = 0;
        currentCol < this.activePiece[currentRow].length;
        currentCol++
      ) {
        if (!this.activePiece[currentRow][currentCol]) continue; // Se não for parte da peça, ignora

        // Se a peça travou acima do tabuleiro, é Game Over
        if (this.y + currentRow < 0) {
          gameOver();
          return;
        }

        // Atribui a cor da peça à célula correspondente no tabuleiro
        board[this.y + currentRow][this.x + currentCol] = this.color;
      }
    }

    // Verifica e remove linhas completas
    for (let currentRow = 0; currentRow < ROW; currentRow++) {
      // `every` verifica se todas as colunas da linha não são defaultColor (ou seja, estão preenchidas)
      const allColumnsAreFilled = board[currentRow].every(
        (colColor) => colColor !== defaultColor
      );
      if (allColumnsAreFilled) {
        updateRowAndScore(currentRow); // Se a linha estiver completa, atualiza pontuação e remove a linha
      }
    }

    drawBoard(); // Redesenha o tabuleiro após fixar a peça e remover linhas
  }
}

// 5. Funções de Lógica do Jogo

// Desenha a grade inteira do tabuleiro
function drawBoard() {
  for (let currentRow = 0; currentRow < ROW; currentRow++) {
    for (let currentCol = 0; currentCol < COL; currentCol++) {
      const currentSquareColor = board[currentRow][currentCol];
      drawSquare(currentRow, currentCol, currentSquareColor);
    }
  }
  // Atualiza os elementos de pontuação na UI
  for (let scoreElement of scoreElements) scoreElement.innerHTML = score;
  // Atualiza o elemento de velocidade na UI
  speedElement.innerHTML = readableSpeed[speed];
}

// Desenha um único quadrado no canvas
function drawSquare(y, x, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ); // Preenche o quadrado
  ctx.strokeStyle = defaultBorderColor; // Cor da borda
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ); // Desenha a borda do quadrado
}

// Retorna uma nova peça aleatória
function randomPiece() {
  const randomPieceNumber = Math.floor(Math.random() * PIECES.length);
  return new Piece(...PIECES[randomPieceNumber]); // Usa spread operator para passar os argumentos (forma, cor, imagem)
}

// Função para fazer a peça cair um passo
function drop() {
  const now = Date.now();
  const delta = now - dropStart;

  // Só move a peça se o tempo de 'speed' tiver passado
  if (delta > speed) {
    piece.moveDown();
    dropStart = Date.now();
  }
}

// Funções de movimento para o controle do jogador
const moveLeft = () => {
  if (!canMove || isGameOver || isHomeScreen || isPaused) return;
  piece.moveLeft();
};

const moveRight = () => {
  if (!canMove || isGameOver || isHomeScreen || isPaused) return;
  piece.moveRight();
};

const rotatePiece = () => {
  if (!canMove || isGameOver || isHomeScreen || isPaused) return;
  piece.rotate();
};

const moveUp = () => {
  // Mover para cima geralmente é para rotação ou navegação de menu
  if (canMove && !isGameOver && !isHomeScreen && !isPaused) rotatePiece();
  else if (isGameOver) changeGameOverButtonSelection();
};

const moveDown = () => {
  // Mover para baixo faz a peça cair mais rápido ou navega no menu
  if (canMove && !isGameOver && !isHomeScreen && !isPaused) piece.moveDown();
  else if (isGameOver) changeGameOverButtonSelection();
};

const clickMethod = () => {
  if (isGameOver && playAgainBtn.classList.contains("active")) {
    resetGame();
  } else if (isGameOver && quitBtn.classList.contains("active")) {
    quitGame();
  } else if (isHomeScreen) {
    startGame();
  } else if (!isHomeScreen && !isGameOver && !isPaused && canMove) {
    rotatePiece(); // Clique no jogo pode rotacionar a peça (opcional)
  }
};

// Altera a seleção de botões na tela de Game Over
const changeGameOverButtonSelection = () => {
  if (quitBtn.classList.contains("active")) {
    quitBtn.classList.remove("active");
    playAgainBtn.classList.add("active");
  } else {
    playAgainBtn.classList.remove("active");
    quitBtn.classList.add("active");
  }
};

// Lógica para remover uma linha completa e atualizar a pontuação/velocidade
const updateRowAndScore = (row) => {
  canMove = false; // Temporariamente impede movimentos enquanto a linha é removida
  // Move todas as linhas acima da linha removida uma posição para baixo
  for (let y = row; y > 0; y--) {
    for (let x = 0; x < COL; x++) {
      board[y][x] = board[y - 1][x]; // Copia a linha de cima para a linha atual
    }
  }
  // Limpa a primeira linha (topo do tabuleiro)
  for (let x = 0; x < COL; x++) board[0][x] = defaultColor;
  score += 100; // Adiciona pontos
  if (speed > 100) speed -= 20; // Aumenta a velocidade (diminui o tempo de queda)
  canMove = true; // Permite movimentos novamente
};

// --- Funções de gerenciamento de estado do jogo e UI ---

// Inicializa todas as variáveis do jogo e o tabuleiro
const initializeGameVariables = () => {
  isGameOver = false;
  isHomeScreen = false;
  isPaused = false; // Garante que o jogo não está pausado
  canMove = true;
  speed = 500;
  dropStart = Date.now();
  score = 0;
  board = [];

  for (let currentRow = 0; currentRow < ROW; currentRow++) {
    board[currentRow] = [];
    for (let currentCol = 0; currentCol < COL; currentCol++) {
      board[currentRow][currentCol] = defaultColor;
    }
  }
};

// Exibe a tela de Game Over
const gameOver = () => {
  gameOverElement.classList.remove("hidden"); // Mostra a tela de Game Over
  canMove = false; // Impede movimentos
  isGameOver = true; // Define o estado de Game Over
};

// Esconde a tela de Game Over
const removeGameOver = () => {
  gameOverElement.classList.add("hidden");
};

// Inicia um novo jogo
const startGame = () => {
  homeElement.classList.add("hidden"); // Esconde a tela inicial
  gameOverElement.classList.add("hidden"); // Garante que Game Over está escondido
  pauseElement.classList.add("hidden"); // Garante que a tela de pausa está escondida

  initializeGameVariables(); // Prepara as variáveis e o tabuleiro

  drawBoard(); // Desenha o tabuleiro inicial
  piece = randomPiece(); // Obtém a primeira peça
  selectNextPiece(); // Seleciona a próxima peça
  piece.draw(); // Desenha a peça inicial
  // O loop animate() já está rodando e vai continuar o jogo.
};

// Alterna o estado de pausa do jogo
const togglePause = () => {
  // Só pausa se não estiver na tela inicial ou Game Over
  if (!isHomeScreen && !isGameOver) {
    isPaused = !isPaused; // Inverte o estado de pausa

    if (isPaused) {
      pauseElement.classList.remove("hidden"); // Mostra a tela de pausa
    } else {
      pauseElement.classList.add("hidden"); // Esconde a tela de pausa
    }
  }
};

// Reinicia o jogo após um Game Over
const resetGame = () => {
  removeGameOver(); // Esconde a tela de Game Over
  pauseElement.classList.add("hidden"); // Garante que a tela de pausa está escondida

  initializeGameVariables(); // Prepara as variáveis e o tabuleiro
  piece = randomPiece(); // Nova peça inicial
  selectNextPiece(); // Nova próxima peça
  drawBoard(); // Redesenha o tabuleiro
  piece.draw(); // Desenha a nova peça
  // O loop animate() já está rodando.
};

// Retorna para a tela inicial
const quitGame = () => {
  gameOverElement.classList.add("hidden"); // Esconde Game Over
  pauseElement.classList.add("hidden"); // Garante que a tela de pausa está escondida
  homeElement.classList.remove("hidden"); // Mostra tela inicial
  isHomeScreen = true; // Define para tela inicial
  isGameOver = false; // Não está mais em Game Over
  isPaused = false; // Não está mais pausado
  // O tabuleiro será reiniciado em startGame() se o usuário clicar em "START" novamente.
};

// Seleciona a próxima peça e atualiza a imagem de "próxima peça"
const selectNextPiece = () => {
  nextPiece = randomPiece(); // Gera a próxima peça
  const element = document.getElementById("next-piece"); // Assume que há um <img> com ID "next-piece"
  // O caminho da imagem deve ser relativo ao seu index.html
  element.src = `assets/images/${nextPiece.image}`;
};

// 6. Game Loop Principal
let lastTime = 0;
function animate(currentTime = 0) {
  const deltaTime = currentTime - lastTime;

  // Apenas atualiza a lógica do jogo se não estiver na tela inicial, não em Game Over E NÃO ESTIVER PAUSADO
  if (!isHomeScreen && !isGameOver && !isPaused) {
    drop(); // Tenta mover a peça para baixo
  }

  drawBoard(); // Sempre redesenha o tabuleiro para refletir o estado atual (mesmo pausado)

  lastTime = currentTime;
  requestAnimationFrame(animate); // Continua o loop de animação
}

// 7. Event Listeners
startBtn.addEventListener("click", startGame); // Botão iniciar
playAgainBtn.addEventListener("click", resetGame); // Botão jogar novamente
quitBtn.addEventListener("click", quitGame); // Botão sair
document.addEventListener("keydown", CONTROL); // Escuta eventos de teclado

const CONTROL = (event) => {
  // Tecla de pausa pode ser pressionada a qualquer momento
  // (desde que não esteja na tela inicial ou Game Over)
  if (event.code === "KeyP" && !isHomeScreen && !isGameOver) {
    event.preventDefault();
    togglePause();
    return; // Sai da função para não processar outros movimentos
  }

  // Se o jogo estiver pausado, Game Over ou na tela inicial, impede outros movimentos de jogo
  if (isPaused || isGameOver || isHomeScreen) {
    return;
  }

  const moveFunctions = {
    ArrowLeft: moveLeft,
    KeyA: moveLeft,
    ArrowRight: moveRight,
    KeyD: moveRight,
    ArrowUp: moveUp,
    Space: rotatePiece,
    KeyW: rotatePiece,
    ArrowDown: moveDown,
    KeyS: moveDown,
    Enter: clickMethod,
  };

  const moveMethod = moveFunctions[event.code];
  if (!!moveMethod) {
    event.preventDefault();
    moveMethod();
  }
};

// --- Início do jogo ---
// Desenha o tabuleiro uma vez ao carregar para mostrar o fundo cinza
drawBoard();
// Inicia o loop de animação
animate();