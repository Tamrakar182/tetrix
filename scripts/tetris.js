let collideSound = new Audio("../collide.mp3");
let lineClear = new Audio("https://www.vertigogaming.org/downloads/svencoop/sound/sc_tetris/clear.wav");

// imports
import { COLS, ROWS } from "./constants.js";
import { score, updateScore } from "./canvas.js";
import { generateNewPiece, createMatrix } from "./utils.js";

// the various document elements
const scoreElement = document.getElementById('score');
const linesElement = document.getElementById('lines');

// game variables
let linesCleared = 0;
export let player = generateNewPiece();

export let field = createMatrix(COLS, ROWS);
export function updateField(newField) {
    field = newField;
}


let isColliding = false;

// collision detection
function collide(field, player) {
    const { piece, position } = player;
    for (let yAxis = 0; yAxis < piece.length; ++yAxis) {
        for (let xAxis = 0; xAxis < piece[yAxis].length; ++xAxis) {
            if (piece[yAxis][xAxis] !== 0) {
                const fieldY = yAxis + position.yAxis;
                const fieldX = xAxis + position.xAxis;

                // out of bounds
                if (fieldY < 0 || fieldY >= field.length || fieldX < 0 || fieldX >= field[0].length) {
                    return true;
                }

                // other piece
                if (field[fieldY][fieldX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function checkCollisionAndGeneratePiece() {
    if (collide(field, player)) {
        if (!isColliding) {
            collideSound.play();
            isColliding = true;
            collideSound.onended = function() {
                isColliding = false;
            };
        }
        if (player.position.yAxis === 0) {
            return true;
        }
        player.position.yAxis--;
        field = join(field, player);
        checkForCompletedLines();
        player.position.yAxis = -1;
        player = { ...player, ...generateNewPiece() };
    }
}

function checkForCompletedLines() {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        let rowFilled = true;
        for (let x = 0; x < COLS; x++) {
            if (field[y][x] === 0) {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            field.splice(y, 1);
            field.unshift(new Array(COLS).fill(0));
            linesCleared++;
            y++;
        }
    }
    if (linesCleared > 0) {
        lineClear.play();
        updateScoreAndLines(linesCleared * 100, linesCleared);
    }
}

// piece rotation & join
function rotate(piece, control) {
    for (let yAxis = 0; yAxis < piece.length; yAxis++) {
        for (let xAxis = 0; xAxis < yAxis; xAxis++) {
            [piece[xAxis][yAxis], piece[yAxis][xAxis]] = [piece[yAxis][xAxis], piece[xAxis][yAxis]];
        }
    }
    if (control > 0) {
        piece.forEach((row) => row.reverse());
    } else {
        piece.reverse();
    }
}

function join(field, player) {
    const copyField = field.map(row => row.slice());

    player.piece.forEach((row, yAxis) => {
        row.forEach((value, xAxis) => {
            if (value != 0) {
                const fieldY = yAxis + player.position.yAxis;
                const fieldX = xAxis + player.position.xAxis;
                copyField[fieldY][fieldX] = player.color;
            }
        });
    });

    return copyField;
}

function updateScoreAndLines(addedScore, addedLines) {
    updateScore(score+addedScore);
    scoreElement.textContent = score;
    linesCleared += addedLines;
    linesElement.textContent = linesCleared;
}

// player movements
function playerXMovement(control) {
    player.position.xAxis += control;
    if (collide(field, player)) {
        if (!isColliding) {
            collideSound.play();
            isColliding = true;
            collideSound.onended = function() {
                isColliding = false;
            };
        }
        player.position.xAxis -= control;
    }
}

function playerDownMovement(control = 1) {
    player.position.yAxis += control;
    if (collide(field, player)) {
        if (!isColliding) {
            collideSound.play();
            isColliding = true;
            collideSound.onended = function() {
                isColliding = false;
            };
        }
        player.position.yAxis -= control;
    }
}

function playerRotate(control) {
    const originalPosition = player.position.xAxis;
    let offset = 1;
    rotate(player.piece, control);
    while (collide(field, player)) {
        if (!isColliding) {
            collideSound.play();
            isColliding = true;
            collideSound.onended = function() {
                isColliding = false;
            };
        }
        player.position.xAxis += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.piece[0].length) {
            rotate(player.piece, -control);
            player.position.xAxis = originalPosition;
            return;
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
        playerXMovement(-1);
    } else if(e.key === "ArrowRight" || e.key === "d") {
        playerXMovement(1);
    } else if(e.key === "ArrowDown" || e.key === "s") {
        playerDownMovement();
    } else if(e.key === "ArrowUp" || e.key === "w" || e.key === " ") {
        playerRotate(1);
    }
})