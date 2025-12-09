import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GameBoard from './components/GameBoard';
import PromoModal from './components/PromoModal';
import LoseModal from './components/LoseModal';
import Button from './components/Button';
import { GameState } from './types';
import { createInitialState, makeMove } from './utils/game';
import { getAIMove } from './utils/ai';
import { generatePromoCode } from './utils/promo';
import { reportGameResult } from './services/api';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const aiProcessingRef = useRef(false);

  // AI ход после хода игрока
  useEffect(() => {
    // Проверяем, что сейчас ход AI и игра идет, и AI еще не обрабатывает ход
    if (gameState.currentPlayer === 'O' && gameState.status === 'playing' && !aiProcessingRef.current) {
      aiProcessingRef.current = true;
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setGameState(prevState => {
          // Двойная проверка: игра все еще идет и ход AI
          if (prevState.currentPlayer !== 'O' || prevState.status !== 'playing') {
            aiProcessingRef.current = false;
            setIsProcessing(false);
            return prevState;
          }
          // Делаем ход AI
          const aiMove = getAIMove(prevState.board);
          const newState = makeMove(prevState, aiMove);
          aiProcessingRef.current = false;
          setIsProcessing(false);
          return newState;
        });
      }, 600); // Небольшая задержка для UX
      return () => {
        clearTimeout(timer);
        aiProcessingRef.current = false;
        setIsProcessing(false);
      };
    }
  }, [gameState.currentPlayer, gameState.status]);

  // Обработка результатов игры
  useEffect(() => {
    if (gameState.status === 'win') {
      const code = generatePromoCode();
      setPromoCode(code);
      reportGameResult('win', code).catch(err => {
        console.error('Failed to report win:', err);
      });
    } else if (gameState.status === 'lose') {
      setShowLoseModal(true);
      reportGameResult('lose').catch(err => {
        console.error('Failed to report lose:', err);
      });
    }
  }, [gameState.status]);

  const handleCellClick = (index: number) => {
    if (gameState.status !== 'playing' || gameState.currentPlayer !== 'X' || isProcessing) {
      return;
    }
    const newState = makeMove(gameState, index);
    setGameState(newState);
  };

  const handleNewGame = () => {
    setGameState(createInitialState());
    setPromoCode(null);
    setShowLoseModal(false);
    setIsProcessing(false);
    aiProcessingRef.current = false;
  };

  const handleClosePromoModal = () => {
    setPromoCode(null);
    handleNewGame();
  };

  const handleCloseLoseModal = () => {
    setShowLoseModal(false);
    handleNewGame();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
            Крестики-нолики
          </h1>
          <p className="text-gray-600 text-lg">
            {gameState.status === 'playing' 
              ? (gameState.currentPlayer === 'X' ? 'Ваш ход!' : 'Ход противника...')
              : gameState.status === 'draw'
              ? 'Ничья!'
              : ''}
          </p>
        </motion.div>

        {/* Game board container */}
        <motion.div
          className="glass-strong rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 mb-6 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <GameBoard
            board={gameState.board}
            winningLine={gameState.winningLine}
            onCellClick={handleCellClick}
            disabled={gameState.status !== 'playing' || gameState.currentPlayer !== 'X' || isProcessing}
          />
        </motion.div>

        {/* New game button */}
        {gameState.status !== 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Button onClick={handleNewGame}>
              Новая игра
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Modals */}
      {promoCode && (
        <PromoModal code={promoCode} onClose={handleClosePromoModal} />
      )}

      {showLoseModal && (
        <LoseModal onPlayAgain={handleCloseLoseModal} />
      )}

      {/* Loading overlay for AI move */}
      {isProcessing && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-strong rounded-2xl p-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="text-2xl">🤔</div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
