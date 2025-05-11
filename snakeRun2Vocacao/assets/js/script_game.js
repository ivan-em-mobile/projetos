"use strict";

// Definir o tipo de canvas, jogo 2D - Snake Run 2
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Definindo a visualização da pontuação, exibir play
const pontuacaoElemento = document.querySelector(".score--value");
const pontuacaoFinalElemento = document.querySelector(".final-score > span");
const menuTela = document.querySelector(".menu-screen");
const botaoJogar = document.querySelector(".btn-play");
const timerValorElemento = document.querySelector(".timer > .timer--value");

// Definindo o tamanho da Snake
const tamanhoCelula = 30;

// Criando a Snake por array, sendo preenchido e movimentado na tela
const posicaoInicial = { x: 270, y: 240 };
let cobra = [posicaoInicial];

let direcao, idDoLoop;
let tempoDecorrido = 0;
let intervaloTempo;

// Criar a pontuação das maçãs em dez em dez pontos
const incrementarPontuacao = () => {
    pontuacaoElemento.innerText = +pontuacaoElemento.innerText + 10;
};

// Criar uma posição aleatória da Maçã
const gerarNumeroAleatorio = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

// Definir uma posição da Maçã dentro do canvas
const gerarPosicaoAleatoria = () => {
    const numero = gerarNumeroAleatorio(0, canvas.width - tamanhoCelula);
    return Math.round(numero / 30) * 30;
};

const gerarCorAleatoria = () => {
    const vermelho = gerarNumeroAleatorio(0, 255);
    const verde = gerarNumeroAleatorio(0, 255);
    const azul = gerarNumeroAleatorio(0, 255);
    return `rgb(${vermelho}, ${verde}, ${azul})`;
};

// Criando a const para a Maçã
const comida = {
    x: gerarPosicaoAleatoria(),
    y: gerarPosicaoAleatoria(),
    cor: gerarCorAleatoria()
};

// Definindo a posição inicial da Maçã
const desenharComida = () => {
    const { x, y, cor } = comida;

    ctx.shadowColor = cor;
    ctx.shadowBlur = 20;
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, tamanhoCelula, tamanhoCelula);
    ctx.shadowBlur = 0;
};

// A const desenharCobra recebe os elementos e cria um começo da Cobra
const desenharCobra = () => {
    ctx.fillStyle = "#66CDAA";

    cobra.forEach((posicao, indice) => {
        if (indice === cobra.length - 1) {
            ctx.fillStyle = "#FFA500";
        }
        ctx.fillRect(posicao.x, posicao.y, tamanhoCelula, tamanhoCelula);
    });
};

// Mover dentro da Grade
const moverCobra = () => {
    if (!direcao) return;

    const cabeca = cobra[cobra.length - 1];
    let novaCabeca;

    if (direcao === "right") {
        novaCabeca = { x: cabeca.x + tamanhoCelula, y: cabeca.y };
    } else if (direcao === "left") {
        novaCabeca = { x: cabeca.x - tamanhoCelula, y: cabeca.y };
    } else if (direcao === "down") {
        novaCabeca = { x: cabeca.x, y: cabeca.y + tamanhoCelula };
    } else if (direcao === "up") {
        novaCabeca = { x: cabeca.x, y: cabeca.y - tamanhoCelula };
    }

    cobra.push(novaCabeca);
    cobra.shift();
};

// Cria uma exibição de Grid para os jogadores visualizar a tela do jogo
const desenharGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#DCDCDC";

    for (let i = tamanhoCelula; i < canvas.width; i += tamanhoCelula) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
};

// Obtém a referência para o elemento de áudio
const somComer = document.getElementById("eatSound");

// Criar uma verificação se houve contato com a cabeça da Cobra toca a Maçã
const verificarComidaComida = () => {
    const cabeca = cobra[cobra.length - 1];

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        incrementarPontuacao();
        cobra.push({ ...cabeca }); // Adiciona um novo segmento à cobra

        // Reproduz o som de comer
        if (somComer) {
            somComer.currentTime = 0; // Reinicia o som para permitir reprodução rápida
            somComer.play();
        }

        let x = gerarPosicaoAleatoria();
        let y = gerarPosicaoAleatoria();

        while (cobra.find((posicao) => posicao.x === x && posicao.y === y)) {
            x = gerarPosicaoAleatoria();
            y = gerarPosicaoAleatoria();
        }

        comida.x = x;
        comida.y = y;
        comida.cor = gerarCorAleatoria();
    }
};

// Criar uma condição para checar o limite da parede e caso a Cobra toque em si
const verificarColisao = () => {
    const cabeca = cobra[cobra.length - 1];
    const limiteCanvas = canvas.width - tamanhoCelula;
    const indicePescoco = cobra.length - 2;

    const colisaoParede =
        cabeca.x < 0 || cabeca.x > limiteCanvas || cabeca.y < 0 || cabeca.y > limiteCanvas;

    const colisaoSelf = cobra.find((posicao, indice) => {
        return indice < indicePescoco && posicao.x === cabeca.x && posicao.y === cabeca.y;
    });

    if (colisaoParede || colisaoSelf) {
        finalizarJogo();
    }
};


// Função para iniciar o contador de tempo
const iniciarContadorTempo = () => {
    tempoDecorrido = 0;
    timerValorElemento.innerText = tempoDecorrido;
    intervaloTempo = setInterval(() => {
        tempoDecorrido++;
        timerValorElemento.innerText = tempoDecorrido;
    }, 1000); // Atualiza a cada 1 segundo (1000 milissegundos)
};

// Função para parar o contador de tempo
const pararContadorTempo = () => {
    clearInterval(intervaloTempo);
};

// Função para iniciar o jogo
const iniciarJogo = () => {
    pontuacaoElemento.innerText = "00";
    menuTela.style.display = "none";
    canvas.style.filter = "none";
    cobra = [posicaoInicial];
    direcao = undefined;
    tempoDecorrido = 0;
    timerValorElemento.innerText = tempoDecorrido;
    iniciarContadorTempo();
    loopDoJogo();
};

// Função para finalizar o jogo
const finalizarJogo = () => {
    direcao = undefined;
    pararContadorTempo();
    menuTela.style.display = "flex";
    pontuacaoFinalElemento.innerText = pontuacaoElemento.innerText;
    canvas.style.filter = "blur(2px)";
};
// Exibe as const's em tela para exibir o Game Snake
const loopDoJogo = () => {
    clearInterval(idDoLoop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharGrid();
    desenharComida();
    moverCobra();
    desenharCobra();
    verificarComidaComida();
    verificarColisao();

    idDoLoop = setTimeout(() => {
        loopDoJogo();
    }, 300);
};

/* Função para iniciar o jogo
const iniciarJogo = () => {
    pontuacaoElemento.innerText = "00";
    menuTela.style.display = "none";
    canvas.style.filter = "none";
    cobra = [posicaoInicial];
    direcao = undefined;
    tempoDecorrido = 0;
    timerValorElemento.innerText = tempoDecorrido;
    iniciarContadorTempo();
    loopDoJogo();
};*/

// Criando a direção da Cobra usando o teclado e definido, limite de tela
loopDoJogo();

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direcao !== "left") {
        direcao = "right";
    } else if (key === "ArrowLeft" && direcao !== "right") {
        direcao = "left";
    } else if (key === "ArrowDown" && direcao !== "up") {
        direcao = "down";
    } else if (key === "ArrowUp" && direcao !== "down") {
        direcao = "up";
    }
});

// Criando o botão re-iniciar o Game Snake-Run2
botaoJogar.addEventListener("click", iniciarJogo);

// Iniciar o jogo pela primeira vez
iniciarJogo();