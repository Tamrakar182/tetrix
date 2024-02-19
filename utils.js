import { pieces, pieceColors } from "./constants.js";

export function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

export function createPiece(type) {
    switch (type) {
        case 'T':
            return [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ];
        case 'O':
            return [
                [1, 1, 0],
                [1, 1, 0],
                [0, 0, 0],
            ];
        case 'L':
            return [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
            ];
        case 'J':
            return [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0],
            ];
        case 'I':
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        case 'S':
            return [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ];
        case 'Z':
            return [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ];
    }
}

export function generateNewPiece() {
    const randomIndex = pieces.length * Math.random() | 0;
    const newPiece = createPiece(pieces[randomIndex]);
    const newColor = pieceColors[randomIndex];
    return {
        position: { xAxis: 4, yAxis: -1 },
        piece: newPiece, 
        color: newColor,
    };
}