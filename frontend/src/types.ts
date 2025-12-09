export type Player = 'X' | 'O' | null;
export type GameStatus = 'playing' | 'win' | 'lose' | 'draw';

export interface GameState {
  board: Player[];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player;
  winningLine: number[] | null;
}

