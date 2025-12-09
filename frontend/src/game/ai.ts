import type { BoardState, CellValue } from "../types";

const lines: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const availableMoves = (board: BoardState): number[] =>
  board
    .map((cell, idx) => (cell === null ? idx : -1))
    .filter((idx) => idx >= 0);

const checkLine = (board: BoardState, line: number[]): CellValue => {
  const [a, b, c] = line;
  if (board[a] && board[a] === board[b] && board[b] === board[c]) {
    return board[a];
  }
  return null;
};

const findWinningMove = (board: BoardState, player: CellValue): number | null => {
  for (const line of lines) {
    const cells = line.map((idx) => board[idx]);
    const emptyIdx = line.find((idx) => board[idx] === null);
    const marks = cells.filter((v) => v === player).length;
    if (emptyIdx !== undefined && marks === 2) {
      return emptyIdx;
    }
  }
  return null;
};

const preferedOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

export const pickAiMove = (board: BoardState): number => {
  // 1) Try to win
  const winMove = findWinningMove(board, "O");
  if (winMove !== null) return winMove;

  // 2) Block player win
  const blockMove = findWinningMove(board, "X");
  if (blockMove !== null) return blockMove;

  // 3) Prefer center, then corners, then edges
  for (const idx of preferedOrder) {
    if (board[idx] === null) return idx;
  }

  // 4) Fallback to first free (should not happen)
  const free = availableMoves(board);
  return free.length ? free[0] : -1;
};

export const detectWinner = (board: BoardState): CellValue => {
  for (const line of lines) {
    const winner = checkLine(board, line);
    if (winner) return winner;
  }
  return null;
};

export const isDraw = (board: BoardState): boolean =>
  board.every((cell) => cell !== null) && !detectWinner(board);


