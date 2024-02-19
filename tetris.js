import { Spiece, field } from "./constants.js";

const player = {
    position: { xAxis: 4, yAxis: -1 },
    piece: Spiece,
}

function drawPiece(canvasContext, piece, offset) {
    piece.forEach((row, yAxis) => {
        row.forEach((value, xAxis) => {
            if (value !== 0) {
                canvasContext.fillStyle = "blue";
                canvasContext.fillRect(xAxis + offset.xAxis, yAxis + offset.yAxis, 1, 1);
            }
        })
    })
}

function draw(canvasContext) {
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    drawPiece(canvasContext, field, { x: 0, y: 0 });
    drawPiece(canvasContext, player.piece, player.position);
}

let dCounter = 0;
let dropInterval = 500;
let lastTime = 0;

export function startUpdating(canvasContext) {
    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;
        dCounter += deltaTime;
        if (dCounter > dropInterval) {
            player.position.yAxis++;
            dCounter = 0;

            if (collide(field, player)) {
                player.position.yAxis--;
            }
        }

        draw(canvasContext);
        requestAnimationFrame(update);
    }

    update();
}

function collide(field, player) {
    const [piece, position] = [player.piece, player.position];
    for (let yAxis = 0; yAxis < piece.length; ++yAxis) {
        for (let xAxis = 0; xAxis < piece[yAxis].length; ++xAxis) {
            if (piece[yAxis][xAxis] !== 0 && (field[yAxis + position.yAxis] && field[yAxis + position.yAxis][xAxis + position.xAxis]) !== 0) {
                return true;
            }

        }
    }
    return false;
}
