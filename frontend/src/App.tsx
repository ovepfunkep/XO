import { useEffect, useMemo, useState } from "react";
import { detectWinner, isDraw, pickAiMove } from "./game/ai";
import { reportResult } from "./services/api";
import { generatePromoCode, clientId as resolveClientId } from "./utils/promo";
import type { BoardState, GameStatus } from "./types";
import "./app.css";

const emptyBoard: BoardState = Array(9).fill(null);

const statusCopy: Record<GameStatus, string> = {
  idle: "Готовы сыграть?",
  playing: "Ваш ход — расслабьтесь и ставьте крестик",
  won: "Победа! Вы умнее бота",
  lost: "Бот оказался сильнее",
  draw: "Ничья — честно и спокойно",
};

type Stats = { wins: number; losses: number; draws: number };

const loadStats = (): Stats => {
  const stored = localStorage.getItem("tictactoe-stats");
  if (!stored) return { wins: 0, losses: 0, draws: 0 };
  try {
    return JSON.parse(stored) as Stats;
  } catch {
    return { wins: 0, losses: 0, draws: 0 };
  }
};

const saveStats = (stats: Stats) => {
  localStorage.setItem("tictactoe-stats", JSON.stringify(stats));
};

function App() {
  const [board, setBoard] = useState<BoardState>(emptyBoard);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [aiThinking, setAiThinking] = useState(false);
  const [promo, setPromo] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<Stats>(loadStats);
  const clientId = useMemo(resolveClientId, []);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const reset = () => {
    setBoard(emptyBoard);
    setStatus("playing");
    setPromo(null);
    setMessage("");
    setAiThinking(false);
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishWin = async (finalBoard: BoardState) => {
    const code = generatePromoCode();
    setBoard(finalBoard);
    setStatus("won");
    setPromo(code);
    setStats((prev) => ({ ...prev, wins: prev.wins + 1 }));
    try {
      await reportResult({ result: "win", code, board: finalBoard, clientId });
      setMessage("Промокод выдан и отправлен в Telegram.");
    } catch (err) {
      console.error("reportResult failed", err);
      setMessage("Не удалось отправить данные в бота. Код сохранён локально.");
    }
  };

  const finishLose = async (finalBoard: BoardState) => {
    setBoard(finalBoard);
    setStatus("lost");
    setStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
    try {
      await reportResult({ result: "lose", board: finalBoard, clientId });
      setMessage("Результат отправлен в Telegram. Попробуете ещё?");
    } catch (err) {
      console.error("reportResult failed", err);
      setMessage("Не удалось связаться с ботом. Можно сыграть снова.");
    }
  };

  const finishDraw = (finalBoard: BoardState) => {
    setBoard(finalBoard);
    setStatus("draw");
    setStats((prev) => ({ ...prev, draws: prev.draws + 1 }));
  };

  const handleCellClick = (index: number) => {
    if (status !== "playing" || aiThinking) return;
    if (board[index]) return;

    const nextBoard: BoardState = [...board];
    nextBoard[index] = "X";

    const winner = detectWinner(nextBoard);
    if (winner === "X") {
      finishWin(nextBoard);
      return;
    }
    if (isDraw(nextBoard)) {
      finishDraw(nextBoard);
      return;
    }

    setBoard(nextBoard);
    setAiThinking(true);
    setTimeout(() => {
      const move = pickAiMove(nextBoard);
      if (move === -1) {
        setAiThinking(false);
        return;
      }
      const aiBoard: BoardState = [...nextBoard];
      aiBoard[move] = "O";
      const aiWinner = detectWinner(aiBoard);
      if (aiWinner === "O") {
        finishLose(aiBoard);
      } else if (isDraw(aiBoard)) {
        finishDraw(aiBoard);
      } else {
        setBoard(aiBoard);
      }
      setAiThinking(false);
    }, 320);
  };

  const renderCell = (idx: number) => (
    <button
      key={idx}
      className="cell"
      onClick={() => handleCellClick(idx)}
      disabled={status !== "playing" || aiThinking || board[idx] !== null}
      aria-label={`Клетка ${idx + 1}`}
    >
      {board[idx]}
    </button>
  );

  return (
    <div className="page">
      <header className="hero">
        <div className="title-block">
          <p className="eyebrow">Для отдыха и фокуса</p>
          <h1>Спокойная партия крестиков-ноликов</h1>
          <p className="lede">
            Лёгкая визуальная палитра, плавные анимации и честный бот. Подарок — промокод при победе.
          </p>
          <div className="cta-row">
            <button className="primary" onClick={reset}>
              Сыграть сейчас
            </button>
            <button className="ghost" onClick={() => setStatus("playing")} disabled={status === "playing"}>
              Продолжить партию
            </button>
          </div>
          <div className="stats">
            <span>Побед: {stats.wins}</span>
            <span>Поражений: {stats.losses}</span>
            <span>Ничьих: {stats.draws}</span>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="board-card">
          <div className="board-header">
            <div>
              <p className="status-label">Статус</p>
              <p className={`status ${status}`}>{statusCopy[status]}</p>
            </div>
            <div className="pill">{aiThinking ? "Бот думает..." : "Ваш ход"}</div>
          </div>

          <div className="board-grid">{Array.from({ length: 9 }).map((_, idx) => renderCell(idx))}</div>

          <div className="actions">
            <button className="primary" onClick={reset}>
              Сыграть ещё
            </button>
            <button className="ghost" onClick={() => setBoard(emptyBoard)} disabled={status !== "playing"}>
              Очистить поле
            </button>
          </div>

          {promo && status === "won" && (
            <div className="promo">
              <p className="promo-title">Ваш промокод</p>
              <div className="promo-code">{promo}</div>
              <p className="promo-note">Сохраните код — он уже отправлен в Telegram.</p>
            </div>
          )}

          {status === "lost" && (
            <div className="retry">
              <p>Бот победил. Сделаем реванш?</p>
              <button className="primary" onClick={reset}>
                Попробовать снова
              </button>
            </div>
          )}

          {message && <div className="message">{message}</div>}
        </section>
      </main>
    </div>
  );
}

export default App;


