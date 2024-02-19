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