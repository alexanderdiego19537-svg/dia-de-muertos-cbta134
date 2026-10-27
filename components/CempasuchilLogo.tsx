'use client';

import { motion } from 'framer-motion';

interface CempasuchilLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function CempasuchilLogo({ size = 60, className = '', animated = true }: CempasuchilLogoProps) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </radialGradient>
          <radialGradient id="outerPetal" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="40%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </radialGradient>
          <radialGradient id="innerPetal" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="40%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </radialGradient>
          <filter id="petalGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer petals - 8 petals */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.ellipse
            key={`outer-${i}`}
            cx="60"
            cy="22"
            rx="9"
            ry="20"
            fill="url(#outerPetal)"
            filter="url(#petalGlow)"
            transform={`rotate(${i * 45} 60 60)`}
            opacity="0.95"
            animate={animated ? { opacity: [0.9, 1, 0.9] } : {}}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
          />
        ))}

        {/* Middle petals - 8 petals, rotated 22.5deg */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.ellipse
            key={`mid-${i}`}
            cx="60"
            cy="30"
            rx="7"
            ry="16"
            fill="url(#innerPetal)"
            transform={`rotate(${i * 45 + 22.5} 60 60)`}
            opacity="0.85"
            animate={animated ? { opacity: [0.8, 0.95, 0.8] } : {}}
            transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
          />
        ))}

        {/* Inner ring petals - 12 petals */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.ellipse
            key={`inner-${i}`}
            cx="60"
            cy="38"
            rx="4"
            ry="9"
            fill="#FEF08A"
            transform={`rotate(${i * 30} 60 60)`}
            opacity="0.9"
          />
        ))}

        {/* Center circle */}
        <circle cx="60" cy="60" r="14" fill="url(#centerGlow)" />
        <circle cx="60" cy="60" r="10" fill="#FEF9C3" opacity="0.5" />
        <circle cx="60" cy="60" r="6" fill="#FFFDE7" opacity="0.8" />

        {/* Center dots pattern */}
        {Array.from({ length: 6 }).map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={60 + 8 * Math.cos((i * Math.PI * 2) / 6)}
            cy={60 + 8 * Math.sin((i * Math.PI * 2) / 6)}
            r="1.5"
            fill="#92400E"
            opacity="0.7"
          />
        ))}
      </svg>
    </motion.div>
  );
}
