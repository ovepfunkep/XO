import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-xl',
    secondary: 'glass-strong text-gray-700 hover:bg-white/50',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  );
}

