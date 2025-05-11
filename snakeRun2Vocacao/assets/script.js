//Definir o tipo de canvas, jogo 2D - Snake Run 2

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


//Definido a visualização do score, exibir play
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")



//definindo o tamanho da Snake
const size = 30



//criando a Snake por array, sendo preenchido e movimentado na tela
const initialPosition = { x: 270, y: 240 }
let snake = [initialPosition]

//Forma Anterior de criar a Snake Run
/*const snake = [
  { x: 300, y: 240 },
  { x: 330, y: 240 },
  { x: 360, y: 240 }
]*/


/*Criar a pontuação das apple em dez em dez pontos*/ 
const incrementScore = () => {
  score.innerText = + score.innerText + 10
}



//Criar uma posição aleatoria da Apple
const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}



//Definir uma posição da Appple dentro do canvas
const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size)
  return Math.round(number / 30) * 30
}


const randomColor = () => {
  const red = randomNumber(0, 255)
  const green = randomNumber(0, 255)
  const blue = randomNumber(0, 255)

  return `rgb(${red}, ${green}, ${blue})`
}


//Criando a const para a Apple, Sempre Laranja
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
}

let direction, loopId

//definindo a posição inicial da Apple
const drawFood = () => {
  const { x, y, color } = food

  ctx.shadowColor = color
  ctx.shadowBlur = 20
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}



//A const desenhSnake recebe os elementos e cria um começo da Snake
const drawSnake = () => {
  ctx.fillStyle = "#66CDAA"

  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "#FFA500"
    }

    ctx.fillRect(position.x, position.y, size, size)
  })
}



//Mover dentro da Grade
const moveSnake = () => {
  if (!direction) return

  const head = snake[snake.length - 1]

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y })
  }

  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y })
  }

  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size })
  }

  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size })
  }

  snake.shift()
}



//Cria uma exibição de Grid para os jogadores visualizar a tela do jogo
const drawGrid = () => {
  ctx.lineWidth = 1
  ctx.strokeStyle = "#DCDCDC"

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()
  }
}



//Criar uma verificação se houve contato com a head Snake toca a Apple
const chackEat = () => {
  const head = snake[snake.length - 1]

  if (head.x == food.x && head.y == food.y) {
    incrementScore()
    snake.push(head)
    //audio.play()


    let x = randomPosition()
    let y = randomPosition()

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition()
      y = randomPosition()
    }

    food.x = x
    food.y = y
    food.color = randomColor()
  }
}



//Criar uma condição para checar o limite da parede e caso a Snake toque e si
const checkCollision = () => {
  const head = snake[snake.length - 1]
  const canvasLimit = canvas.width - size
  const neckIndex = snake.length - 2

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y
  })

  if (wallCollision || selfCollision) {
    gameOver()
  }
}



//Criar um Game Over, aparecendo na tela
const gameOver = () => {
  direction = undefined

  menu.style.display = "flex"
  finalScore.innerText = score.innerText
  canvas.style.filter = "blur(2px)"
}



//Exibe as const's em tela para exibir o Game Snake
const gameLoop = () => {
  clearInterval(loopId)

  ctx.clearRect(0, 0, 600, 600)
  drawGrid()
  drawFood()
  moveSnake()
  drawSnake()
  chackEat()
  checkCollision()

  loopId = setTimeout(() => {
    gameLoop()
  }, 300)
}



//Criando a direção da Snake usando o teclado e definido, limite de tela
gameLoop()

document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right"
  }

  if (key == "ArrowLeft" && direction != "right") {
    direction = "left"
  }

  if (key == "ArrowDown" && direction != "up") {
    direction = "down"
  }

  if (key == "ArrowUp" && direction != "down") {
    direction = "up"
  }
})



//Criando o botão re-iniciar o Game Snake-Run2
buttonPlay.addEventListener("click", () => {
  score.innerText = "00"
  menu.style.display = "none"
  canvas.style.filter = "none"

  snake = [initialPosition]
})