// imports
import { BLOCK_SIZE, COLS, ROWS } from "./constants.js";
import { checkCollisionAndGeneratePiece, player, field, score } from "./tetris.js";

// the various document elements
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('play-button');
const gameOverScreen = document.getElementById('game-over');
const gameStartScreen = document.getElementById('game-start');
const finalScore = document.getElementById('final-score');

// setting the canvas width and height & scaling the content
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

// event listener for the start button
startButton.addEventListener("click", () => {
    gameStartScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    canvas.style.display = "block";
    startUpdating();
    startButton.style.display = "none";
});

// draws a tetris piece
function drawPiece(piece, offset) {
    piece.forEach((row, yAxis) => {
        row.forEach((value, xAxis) => {
            if (value !== 0) {
                ctx.fillStyle = player.color;
                ctx.fillRect(xAxis + offset.xAxis, yAxis + offset.yAxis, 1, 1);
            }
        })
    })
}

// draws the game board
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    field.forEach((row, yAxis) => {
        row.forEach((value, xAxis) => {
            if (value !== 0 && typeof value === "string") {
                ctx.fillStyle = value;
                ctx.fillRect(xAxis, yAxis, 1, 1);
            }
        });
    });

    drawPiece(player.piece, player.position);
}

// game variables
let dCounter = 0;
let dropInterval = 500;
let lastTime = 0;
let animationId = null;
let isGameOver = false;

// starts the game loop
function startUpdating() {
    function update(time = 0) {
        if (isGameOver) {
            cancelAnimationFrame(animationId);
            return;
        }

        const deltaTime = time - lastTime;
        lastTime = time;
        dCounter += deltaTime;
        if (dCounter > dropInterval) {
            player.position.yAxis++;
            dCounter = 0;
            if (checkCollisionAndGeneratePiece()) {
                gameOver(ctx);
                return;
            }
        }

        draw(ctx);
        animationId = requestAnimationFrame(update);
    }
    animationId = requestAnimationFrame(update);
}

// game over function
function gameOver() {
    cancelAnimationFrame(animationId);
    isGameOver = true;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "red";
    finalScore.textContent = `${score}`;
    gameOverScreen.style.display = "flex";
    gameOverScreen.style.height = ROWS * BLOCK_SIZE;
    canvas.style.display = "none";
    startButton.style.display = "block";
}



