import { BLOCK_SIZE, COLS, ROWS } from "./constants.js";
import { startUpdating, playerXMovement, playerDownMovement, playerRotate } from "./tetris.js";

const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('play-button');
const gameOverScreen = document.getElementById('game-over');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

startButton.addEventListener("click", () => {
    gameOverScreen.style.display = "none";
    canvas.style.display = "block";
    startUpdating(ctx);
    startButton.style.display = "none";
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        playerXMovement(-1);
    } else if(e.key === "ArrowRight") {
        playerXMovement(1);
    } else if(e.key === "ArrowDown") {
        playerDownMovement();
    } else if(e.key === "ArrowUp") {
        playerRotate(1);
    }
})

let score = 0;
let linesCleared = 0;

export function updateScoreAndLines(addedScore, addedLines) {
    const scoreElement = document.getElementById('score');
    const linesElement = document.getElementById('lines');

    scoreElement.textContent = score + addedScore;
    score += addedScore;
    linesElement.textContent = linesCleared + addedLines;
    linesCleared += addedLines;
}
