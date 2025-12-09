import { motion, AnimatePresence } from 'framer-motion';

interface LoseModalProps {
  onPlayAgain: () => void;
}

export default function LoseModal({ onPlayAgain }: LoseModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop blur */}
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative glass-strong rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-2xl animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />

          {/* Content */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="text-6xl md:text-7xl mb-4">💔</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                Не повезло
              </h2>
              <p className="text-gray-600 text-lg">
                Попробуйте ещё раз!
              </p>
            </motion.div>

            <motion.button
              onClick={onPlayAgain}
              className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Сыграть ещё раз
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

