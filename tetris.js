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
        }

        draw(canvasContext);
        requestAnimationFrame(update);
    }

    update();
}

function join(field, player) {
    player.piece.forEach((row, yAxis) => {
        row.forEach((value, xAxis) => {
            if (value !== 0) {
                field[yAxis + player.position.yAxis][xAxis + player.position.xAxis] = value;
            }
        })
    })
}
