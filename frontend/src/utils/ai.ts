import { Player } from '../types';
import { checkWinner } from './game';

// Rule-based AI: блокировка, выигрыш, центр, углы, случайный
export function getAIMove(board: Player[], player: Player = 'O'): number {
  const opponent = player === 'O' ? 'X' : 'O';
  const emptyIndices = board.map((cell, idx) => cell === null ? idx : -1).filter(idx => idx !== -1);

  // 1. Выигрышный ход
  for (const idx of emptyIndices) {
    const testBoard = [...board];
    testBoard[idx] = player;
    if (checkWinner(testBoard).winner === player) {
      return idx;
    }
  }

  // 2. Блокировка выигрыша противника
  for (const idx of emptyIndices) {
    const testBoard = [...board];
    testBoard[idx] = opponent;
    if (checkWinner(testBoard).winner === opponent) {
      return idx;
    }
  }

  // 3. Центр
  if (board[4] === null) {
    return 4;
  }

  // 4. Углы (случайный порядок)
  const corners = [0, 2, 6, 8].filter(idx => board[idx] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Случайный доступный ход
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

