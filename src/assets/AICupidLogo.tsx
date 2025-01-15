import React from 'react';
import { motion } from 'framer-motion';
import aiCupidLogo from './images/ai-cupid-robot.png';

interface AICupidLogoProps {
  className?: string;
  size?: number;
}

const AICupidLogo: React.FC<AICupidLogoProps> = ({ className = '', size = 500 }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Main AI CUPID logo */}
      <motion.img
        src={aiCupidLogo}
        alt="AI CUPID Logo"
        className="w-full h-full object-contain relative z-10"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated heart rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute inset-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2],
            opacity: [0.8, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: ring * 0.6,
            ease: "easeInOut"
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full absolute inset-0"
            style={{
              filter: `blur(${ring * 0.5}px)`,
              transform: `scale(${1 + ring * 0.1})`
            }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="none"
              stroke={`rgba(219, 39, 119, ${0.3 - ring * 0.05})`}
              strokeWidth="0.5"
              className="animate-pulse"
            />
          </svg>
        </motion.div>
      ))}

      {/* AI Glow effect */}
      <motion.div
        className="absolute inset-0 bg-pink-400/20 rounded-full filter blur-xl"
        animate={{ 
          opacity: [0.4, 0.8, 0.4],
          scale: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating hearts */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 20}%`,
            fontSize: `${1 + i * 0.1}rem`
          }}
          animate={{
            y: [-10, 10],
            x: [-5, 5],
            rotate: [-10, 10],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2 + i,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.3
          }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Tech circuits */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/4 left-1/4 w-1 h-12 bg-gradient-to-b from-transparent via-pink-400 to-transparent transform rotate-45" />
        <div className="absolute bottom-1/4 right-1/4 w-1 h-12 bg-gradient-to-b from-transparent via-pink-400 to-transparent transform -rotate-45" />
      </motion.div>
    </div>
  );
};

export default AICupidLogo; 