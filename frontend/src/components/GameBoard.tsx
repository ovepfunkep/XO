import { motion } from 'framer-motion';
import { Player, GameState } from '../types';

interface GameBoardProps {
  board: Player[];
  winningLine: number[] | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export default function GameBoard({ board, winningLine, onCellClick, disabled }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 md:p-6">
      {board.map((cell, index) => {
        const isWinning = winningLine?.includes(index);
        const isEmpty = cell === null;
        
        return (
          <motion.button
            key={index}
            onClick={() => !disabled && isEmpty && onCellClick(index)}
            disabled={disabled || !isEmpty}
            className={`
              relative aspect-square rounded-2xl md:rounded-3xl
              glass-strong shadow-lg
              flex items-center justify-center
              text-4xl md:text-6xl font-bold
              transition-all duration-300
              ${isEmpty && !disabled ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}
              ${isWinning ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''}
              ${isEmpty ? 'hover:bg-white/50' : ''}
            `}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
            whileHover={isEmpty && !disabled ? { scale: 1.05, y: -2 } : {}}
            whileTap={isEmpty && !disabled ? { scale: 0.95 } : {}}
          >
            {cell === 'X' && (
              <motion.div
                className="text-gradient"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                ✕
              </motion.div>
            )}
            {cell === 'O' && (
              <motion.div
                className="text-gradient"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                ○
              </motion.div>
            )}
            {isWinning && (
              <motion.div
                className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-yellow-200/50 to-pink-200/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

