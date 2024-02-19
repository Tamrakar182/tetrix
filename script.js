import { BLOCK_SIZE, COLS, ROWS } from "./constants.js";
import { startUpdating, playerXMovement, playerDownMovement } from "./tetris.js";

const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('play-button');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

startButton.addEventListener("click", () => {
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
    }
})


