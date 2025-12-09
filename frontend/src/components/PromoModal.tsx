import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface PromoModalProps {
  code: string;
  onClose: () => void;
}

export default function PromoModal({ code, onClose }: PromoModalProps) {
  const [copied, setCopied] = useState(false);

  // Запуск конфетти при открытии модалки
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Конфетти с розовыми и фиолетовыми цветами
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ec4899', '#f472b6', '#a855f7', '#c084fc', '#fbcfe8', '#e9d5ff'],
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ec4899', '#f472b6', '#a855f7', '#c084fc', '#fbcfe8', '#e9d5ff'],
      });
    }, 250);

    // Большой взрыв в центре при открытии
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f472b6', '#a855f7', '#c084fc', '#fbcfe8', '#e9d5ff'],
        zIndex: 9999,
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (copied) setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-2xl animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />

          {/* Content */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="text-6xl md:text-7xl mb-4">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                Победа!
              </h2>
              <p className="text-gray-600 text-lg">
                Ваш промокод на скидку:
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="relative">
                <div className="glass rounded-2xl p-6 md:p-8 backdrop-blur-xl">
                  <div className="text-5xl md:text-6xl font-bold text-gradient tracking-wider mb-4">
                    {code.split('').map((digit, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
                        className="inline-block mx-1"
                      >
                        {digit}
                      </motion.span>
                    ))}
                  </div>
                  <motion.button
                    onClick={copyToClipboard}
                    className="w-full py-3 px-6 rounded-xl glass hover:bg-white/40 transition-all duration-300 text-gray-700 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {copied ? '✓ Скопировано!' : '📋 Копировать'}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.button
              onClick={onClose}
              className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Отлично!
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

