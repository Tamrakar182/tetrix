import { Spiece, field } from "./constants.js";

const player = {
    position: { xAxis: 4, yAxis: -2 },
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