import { createMatrix } from "./utils.js";

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 20;

export const field = createMatrix(COLS, ROWS);

export const Spiece = [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
];
