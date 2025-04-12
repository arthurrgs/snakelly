const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

const box = 20;
let gameLoop;

let snake = [];
let food;
let direction;
let score = 0;

// Imagens da cobra
const imgHead = new Image();
imgHead.src = "skimgs/cbsnake.png";

const imgBody = new Image();
imgBody.src = "skimgs/cpsnake.png";

const imgTail = new Image();
imgTail.src = "skimgs/cdsnake.png";

// Imagem da comida (maçã)
const appleImg = new Image();
appleImg.src = "skimgs/maçã.png";

function startGame() {
  snake = [{ x: 10 * box, y: 10 * box }];
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
  direction = "right";
  score = 0;

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(draw, 150);

  document.getElementById('startBtn').disabled = true;
  document.getElementById('startBtn').innerText = "Jogando...";
}

document.addEventListener("keydown", updateDirection);

function updateDirection(event) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    if (direction !== "right") direction = "left";
  } else if (event.key === "ArrowUp" || event.key === "w") {
    if (direction !== "down") direction = "up";
  } else if (event.key === "ArrowRight" || event.key === "d") {
    if (direction !== "left") direction = "right";
  } else if (event.key === "ArrowDown" || event.key === "s") {
    if (direction !== "up") direction = "down";
  }
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🍏 Desenha a comida
  ctx.drawImage(appleImg, food.x, food.y, box, box);

  // 🐍 Desenha a cobra com rotação
  drawSnake();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "right") snakeX += box;
  if (direction === "left") snakeX -= box;
  if (direction === "up") snakeY -= box;
  if (direction === "down") snakeY += box;

  // ❌ Colisão com parede
  if (
    snakeX < 0 || snakeX >= canvas.width ||
    snakeY < 0 || snakeY >= canvas.height
  ) {
    endGame();
    return;
  }

  // ❌ Colisão com o próprio corpo
  for (let i = 1; i < snake.length; i++) {
    if (snakeX === snake[i].x && snakeY === snake[i].y) {
      endGame();
      return;
    }
  }

  // ✅ Comer comida
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop(); // remove cauda
  }

  const newHead = { x: snakeX, y: snakeY };
  snake.unshift(newHead); // adiciona nova cabeça

  // 🏆 Pontuação
  scoreBox.innerText = "Pontos: " + score;
}

function endGame() {
  clearInterval(gameLoop);
  alert("Fim de jogo! Pontuação: " + score);
  document.getElementById('startBtn').disabled = false;
  document.getElementById('startBtn').innerText = "START";
}

function drawRotatedImage(img, x, y, angle) {
  const expand = 6; // Aumenta o tamanho da imagem
  ctx.save();
  ctx.translate(x + box / 2, y + box / 2);
  ctx.rotate(angle);
  ctx.drawImage(
    img,
    -box / 2 - expand / 2,
    -box / 2 - expand / 2,
    box + expand,
    box + expand
  );
  ctx.restore();
}

function fillGapsBetweenSegments() {
  ctx.fillStyle = "green";
  for (let i = 1; i < snake.length; i++) {
    const curr = snake[i];
    const prev = snake[i - 1];

    const midX = (curr.x + prev.x) / 2;
    const midY = (curr.y + prev.y) / 2;

    // desenha um pequeno retângulo entre os segmentos
    ctx.fillRect(midX + box / 4, midY + box / 4, box / 2, box / 2);
  }
}

function drawSnake() {
  fillGapsBetweenSegments(); // 👈 Preenche espaços entre partes

  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];
    let angle = 0;
    let image;

    if (i === 0) {
      image = imgHead;
      const next = snake[1];
      if (next) {
        if (segment.x < next.x) angle = Math.PI / 2;
        else if (segment.x > next.x) angle = -Math.PI / 2;
        else if (segment.y < next.y) angle = Math.PI;
        else if (segment.y > next.y) angle = 0;
      }    
    } else if (i === snake.length - 1) {
      image = imgTail;
      const prev = snake[i - 1];
      if (prev.x < segment.x) angle = -Math.PI / 2;
      else if (prev.x > segment.x) angle = Math.PI / 2;
      else if (prev.y < segment.y) angle = 0;
      else if (prev.y > segment.y) angle = Math.PI;
    } else {
      image = imgBody;
      const prev = snake[i - 1];
      const next = snake[i + 1];
      if ((prev.x < segment.x && next.x > segment.x) || (prev.x > segment.x && next.x < segment.x)) {
        angle = Math.PI / 2;
      } else if ((prev.y < segment.y && next.y > segment.y) || (prev.y > segment.y && next.y < segment.y)) {
        angle = 0;
      }
    }

    drawRotatedImage(image, segment.x, segment.y, angle);
  }
}


// Cria o elemento da pontuação fora do canvas
const scoreBox = document.createElement("div");
scoreBox.id = "scoreBox";
scoreBox.innerText = "Pontos: 0";
document.body.appendChild(scoreBox);

// Estilo do scoreBox (retângulo arredondado cinza com texto preto)
Object.assign(scoreBox.style, {
  position: "absolute",
  top: (canvas.offsetTop + 10) + "px",
  left: (canvas.offsetLeft - 145) + "px", // Ajuste aqui pra colar no canvas à esquerda
  backgroundColor: "#800080",
  color: "White",
  fontFamily: "Arial, sans-serif",
  fontSize: "18px",
  fontWeight: "bold",
  padding: "10px 20px",
  borderRadius: "15px",
  boxShadow: "0 0 5px rgba(255, 255, 255, 0.95)",
  zIndex: "10"
});
