import { Player, GameState } from '../types';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6], // diagonals
];

export function checkWinner(board: Player[]): { winner: Player; line: number[] | null } {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  return { winner: null, line: null };
}

export function isBoardFull(board: Player[]): boolean {
  return board.every(cell => cell !== null);
}

export function createInitialState(): GameState {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'playing',
    winner: null,
    winningLine: null,
  };
}

export function makeMove(state: GameState, index: number): GameState {
  if (state.board[index] || state.status !== 'playing') {
    return state;
  }

  const newBoard = [...state.board];
  newBoard[index] = state.currentPlayer;

  const { winner, line } = checkWinner(newBoard);
  const isFull = isBoardFull(newBoard);

  let status: GameState['status'] = 'playing';
  if (winner) {
    status = winner === 'X' ? 'win' : 'lose';
  } else if (isFull) {
    status = 'draw';
  }

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    status,
    winner,
    winningLine: line,
  };
}

