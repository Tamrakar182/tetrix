import { createMatrix } from "./utils.js";

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 20;

export const field = createMatrix(COLS, ROWS);

export const pieces = 'TJLOSZI';
export const pieceColors = ['purple', 'yellow', 'orange', 'blue', 'cyan', 'green', 'red'];
