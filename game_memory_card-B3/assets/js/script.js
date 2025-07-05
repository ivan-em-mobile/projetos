// ./assets/js/script.js

const memoryGame = document.getElementById('memory-game');
const movesCountElement = document.getElementById('moves-count');
const restartButton = document.getElementById('restart-button');

let cardsArray = []; // Array para armazenar os IDs e imagens das cartas
const numPairs = 18; // Para 6x6 cartas (36 cartas / 2 = 18 pares)

let hasFlippedCard = false;
let lockBoard = false; // Impede cliques enquanto cartas estão sendo comparadas/viradas de volta
let firstCard, secondCard;
let matchesFound = 0;
let moves = 0;

// Lista de URLs das imagens das cartas (você precisará de 18 imagens diferentes)
// IMPORTANTE: Ajuste este caminho se suas imagens não estiverem na pasta 'img/' na raiz
const cardImages = [
    './assets/img/img1.png', './assets/img/img2.png', './assets/img/img3.png', './assets/img/img4.png',
    './assets/img/img5.png', './assets/img/img6.png', './assets/img/img7.png', './assets/img/img8.png',
    './assets/img/img9.png', './assets/img/img10.png', './assets/img/img11.png', './assets/img/img12.png',
    './assets/img/img13.png', './assets/img/img14.png', './assets/img/img15.png', './assets/img/img16.png',
    './assets/img/img17.png', './assets/img/img18.png'
];

// Função para inicializar o jogo
function initializeGame() {
    cardsArray = [];
    matchesFound = 0;
    moves = 0;
    movesCountElement.textContent = moves; // Reseta o contador de movimentos
    memoryGame.innerHTML = ''; // Limpa o tabuleiro de cartas anteriores

    // Cria os pares de cartas
    for (let i = 0; i < numPairs; i++) {
        cardsArray.push({ id: i, image: cardImages[i] });
        cardsArray.push({ id: i, image: cardImages[i] }); // Adiciona o par
    }

    shuffleCards(cardsArray); // Embaralha as cartas

    // Cria os elementos HTML das cartas
    cardsArray.forEach(card => {
        const memoryCard = document.createElement('div');
        memoryCard.classList.add('memory-card');
        memoryCard.dataset.id = card.id; // Usamos dataset.id para identificar o par

        const frontFace = document.createElement('img');
        frontFace.classList.add('front-face');
        frontFace.src = card.image;
        frontFace.alt = 'Card Front';

        const backFace = document.createElement('img');
        backFace.classList.add('back-face');
        // IMPORTANTE: Ajuste este caminho se sua imagem de fundo não estiver na pasta 'img/' na raiz
        backFace.src = './assets/img/card_back.jpg';
        backFace.alt = 'Card Back';

        memoryCard.appendChild(frontFace);
        memoryCard.appendChild(backFace);

        // Adiciona um listener para cada carta
        // Assegura que classes como 'flip' ou 'match' são removidas antes de adicionar o listener
        // para um novo jogo.
        memoryCard.classList.remove('flip', 'match'); // Garante que a carta não comece virada ou combinada
        memoryCard.addEventListener('click', flipCard);
        memoryGame.appendChild(memoryCard);
    });
}

// Função para embaralhar as cartas (algoritmo de Fisher-Yates)
function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Troca elementos de posição
    }
}

// Função para virar a carta
function flipCard() {
    if (lockBoard) return; // Se o tabuleiro estiver travado, não faz nada
    if (this === firstCard) return; // Evita clicar na mesma carta duas vezes

    // Adiciona a classe 'flip' para virar a carta (controlado pelo CSS)
    this.classList.add('flip'); 

    if (!hasFlippedCard) {
        // Primeiro clique
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segundo clique
    secondCard = this;
    moves++; // Incrementa os movimentos
    movesCountElement.textContent = moves; // Atualiza a exibição
    checkForMatch(); // Verifica se as duas cartas formam um par
}

// Função para verificar se as cartas formam um par
function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {
        disableCards(); // Desabilita as cartas que formaram par
    } else {
        unflipCards(); // Vira as cartas de volta
    }
}

// Se as cartas formarem um par
function disableCards() {
    firstCard.removeEventListener('click', flipCard); // Remove o evento de clique
    secondCard.removeEventListener('click', flipCard);
    
    // Adiciona a classe 'match' para que o CSS possa desabilitar o clique via pointer-events: none;
    firstCard.classList.add('match');
    secondCard.classList.add('match');

    matchesFound++; // Incrementa o contador de pares encontrados
    if (matchesFound === numPairs) {
        setTimeout(() => {
            alert(`Parabéns! Você encontrou todos os pares em ${moves} movimentos!`);
        }, 500);
    }

    resetBoard(); // Reseta as variáveis de controle do tabuleiro
}

// Se as cartas não formarem um par
function unflipCards() {
    lockBoard = true; // Trava o tabuleiro para evitar mais cliques

    setTimeout(() => {
        firstCard.classList.remove('flip'); // Remove a classe 'flip' para virar de volta
        secondCard.classList.remove('flip');
        resetBoard(); // Reseta as variáveis de controle do tabuleiro
    }, 1000); // Tempo para as cartas ficarem viradas antes de virarem de volta (1 segundo)
}

// Função para resetar as variáveis de controle do tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Event listener para o botão de reiniciar
restartButton.addEventListener('click', initializeGame);

// Inicializa o jogo quando a página carrega
initializeGame();