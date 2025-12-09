export type CellValue = "X" | "O" | null;
export type BoardState = CellValue[];
export type GameStatus = "idle" | "playing" | "won" | "lost" | "draw";

export interface ResultPayload {
  result: "win" | "lose";
  code?: string;
  clientId: string;
  board: BoardState;
}


