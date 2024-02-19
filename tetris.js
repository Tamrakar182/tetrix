import { updateScoreAndLines } from "./script.js";
import { COLS, ROWS, BLOCK_SIZE } from "./constants.js";
import { generateNewPiece, createMatrix } from "./utils.js";

let player = generateNewPiece();
let field = createMatrix(COLS, ROWS);
let isGameOver = false;


function drawPiece(canvasContext, piece, offset) {
    piece.forEach((row, yAxis) => {
        row.forEach((value, xAxis) => {
            if (value !== 0) {
                canvasContext.fillStyle = player.color;
                canvasContext.fillRect(xAxis + offset.xAxis, yAxis + offset.yAxis, 1, 1);
            }
        })
    })
}

function draw(canvasContext) {
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

    field.forEach((row, yAxis) => {
        row.forEach((value, xAxis) => {
            if (value !== 0 && typeof value === "string") {
                canvasContext.fillStyle = value;
                canvasContext.fillRect(xAxis, yAxis, 1, 1);
            }
        });
    });

    drawPiece(canvasContext, player.piece, player.position);
}

let dCounter = 0;
let dropInterval = 500;
let lastTime = 0;
let animationId = null;

export function startUpdating(canvasContext) {
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
                gameOver(canvasContext);
                return;
            }
        }

        draw(canvasContext);
        animationId = requestAnimationFrame(update);
    }

    animationId = requestAnimationFrame(update);
}

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

function checkCollisionAndGeneratePiece() {
    if (collide(field, player)) {
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
        updateScoreAndLines(linesCleared * 100, linesCleared);
    }
}

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

export function playerXMovement(control) {
    player.position.xAxis += control;
    if (collide(field, player)) {
        player.position.xAxis -= control;
    }
}

export function playerDownMovement(control = 1) {
    player.position.yAxis += control;
    if (collide(field, player)) {
        player.position.yAxis -= control;
    }
}

export function playerRotate(control) {
    const originalPosition = player.position.xAxis;
    let offset = 1;
    rotate(player.piece, control);
    while (collide(field, player)) {
        player.position.xAxis += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.piece[0].length) {
            rotate(player.piece, -control);
            player.position.xAxis = originalPosition;
            return;
        }
    }
}

function gameOver(canvasContext) {
    cancelAnimationFrame(animationId);
    isGameOver = true;
    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    canvasContext.fillStyle = "red";
    document.getElementById("game-over").style.display = "flex";
    document.getElementById("game-board").style.display = "none";
    document.getElementById("play-button").style.display = "block";
}
