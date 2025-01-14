// Breakout Game with Slider-Based Paddle Movement

// Get canvas element and set up context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas and paddle variables
const ballRadius = 10;
const paddleHeight = 10;
let paddleWidth = 100; // Adjusted width for better responsiveness
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// Bricks and score variables
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

let score = 0;
let lives = 3;
let gameStarted = false;

// Slider for paddle control
const slider = document.getElementById("slider");

// Start button
const startBtn = document.getElementById("startBtn");

// Resize canvas dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.6;
  paddleWidth = canvas.width / 6; // Responsive paddle width
  paddleX = (canvas.width - paddleWidth) / 2;
}
resizeCanvas();

// Start game event
startBtn.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    score = 0;
    lives = 3;
    startBtn.style.display = "none"; // Hide start button
    gameLoop();
  }
});

// Slider event for paddle movement
slider.addEventListener("input", () => {
  const sliderValue = slider.value;
  paddleX = (canvas.width - paddleWidth) * (sliderValue / 100);
});

// Collision Detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Draw functions
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF5733";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#4CAF50";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#3498db";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScoreAndLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 8, 20);
  ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
}

// Game loop
function gameLoop() {
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  drawScoreAndLives();

  collisionDetection();

  x += dx;
  y += dy;

  // Ball collision with walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

// Resize on window change
window.addEventListener("resize", resizeCanvas);
