const gameOverAudio = new Audio("audio/gameOver.wav");
const startAudio = new Audio("audio/start.mp3");

// imports
import { BLOCK_SIZE, COLS, ROWS } from "./constants.js";
import { checkCollisionAndGeneratePiece, player, field, updateField } from "./tetris.js";
import { createMatrix } from "./utils.js";

// the various document elements
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('play-button');
const gameOverScreen = document.getElementById('game-over');
const gameStartScreen = document.getElementById('game-start');
const finalScore = document.getElementById('final-score');
const scoreElement = document.getElementById('score');
const linesElement = document.getElementById('lines');

// game variables
export let score = 0;
export function updateScore(newScore) {
    score = newScore;
}
const previousScore = localStorage.getItem('score');

if (previousScore) {
    document.getElementById('high-score').textContent = previousScore;
}

// setting the canvas width and height & scaling the content
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
gameOverScreen.style.width = `${COLS * BLOCK_SIZE}px`;
gameOverScreen.style.height = `${ROWS * BLOCK_SIZE}px`;
gameStartScreen.style.width = `${COLS * BLOCK_SIZE}px`;
gameStartScreen.style.height = `${ROWS * BLOCK_SIZE}px`;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let gameStarted = false;

function startGame() {
    gameStarted = true;
    startAudio.play();
    gameStartScreen.style.display = "none";
    canvas.style.display = "block";
    if (isGameOver) {
        scoreElement.textContent = "0";
        linesElement.textContent = "0";
        gameOverScreen.style.display = "none";
        updateField(createMatrix(COLS, ROWS));
        score = 0;
        isGameOver = false;
    }
    startUpdating();
    startButton.style.display = "none";
}

// event listener for the start button
startButton.addEventListener("click", () => startGame());
document.addEventListener("keydown", (event) => {
    if(event.key === "Enter" && !gameStarted) {
        startGame();
    }
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
    gameStarted = false;
    gameOverAudio.play();
    cancelAnimationFrame(animationId);
    isGameOver = true;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "red";
    finalScore.textContent = `${score}`;
    if (score > previousScore) {
        localStorage.setItem('score', score);
    }
    gameOverScreen.style.display = "flex";
    gameOverScreen.style.height = ROWS * BLOCK_SIZE;
    canvas.style.display = "none";
    startButton.style.display = "block";
}



