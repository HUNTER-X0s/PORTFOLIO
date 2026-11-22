'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SoundLoungeIconProps {
  isPlaying?: boolean
  isOpen?: boolean
  size?: number
  className?: string
  showBadge?: boolean
}

export function SoundLoungeIcon({
  isPlaying = false,
  isOpen = false,
  size = 20,
  className = '',
  showBadge = false,
}: SoundLoungeIconProps) {
  return (
    <div
      className={cn('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      {/* Background radial glow when active/playing */}
      {(isPlaying || isOpen) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full blur-md pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,229,255,0.6) 0%, rgba(255,45,156,0.4) 50%, rgba(124,58,237,0.2) 100%)',
          }}
        />
      )}

      {/* Main Multi-Colored Dynamic SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 overflow-visible"
      >
        <defs>
          {/* Vibrant Multicolored Gradients */}
          <linearGradient id="sl-cyan-pink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#FF2D9C" />
            <stop offset="100%" stopColor="#9D4EDD" />
          </linearGradient>

          <linearGradient id="sl-bar-cyan" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00FF87" />
          </linearGradient>

          <linearGradient id="sl-bar-pink" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF2D9C" />
            <stop offset="100%" stopColor="#FF6B2B" />
          </linearGradient>

          <linearGradient id="sl-bar-amber" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFD166" />
            <stop offset="100%" stopColor="#FF9F1C" />
          </linearGradient>

          <linearGradient id="sl-bar-purple" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>

          {/* Glow Filter for High Brightness */}
          <filter id="sl-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Circular Aura Pulse (Active Mode) */}
        {isPlaying && (
          <motion.circle
            cx="16"
            cy="16"
            r="14"
            stroke="url(#sl-cyan-pink)"
            strokeWidth="1"
            strokeDasharray="4 3"
            initial={{ rotate: 0, opacity: 0.3 }}
            animate={{ rotate: 360, opacity: [0.3, 0.7, 0.3] }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        )}

        {/* 1. Stylized Eighth Notes (♫) with Vibrant Prismatic Sheen */}
        <g filter="url(#sl-glow)">
          {/* Left note head */}
          <ellipse
            cx="7.5"
            cy="21.5"
            rx="3.2"
            ry="2.4"
            transform="rotate(-22 7.5 21.5)"
            fill="url(#sl-bar-cyan)"
          />
          {/* Left stem */}
          <rect
            x="9"
            y="9"
            width="1.6"
            height="13"
            rx="0.8"
            fill="url(#sl-bar-cyan)"
          />

          {/* Right note head */}
          <ellipse
            cx="18.5"
            cy="19"
            rx="3.2"
            ry="2.4"
            transform="rotate(-22 18.5 19)"
            fill="url(#sl-bar-pink)"
          />
          {/* Right stem */}
          <rect
            x="20"
            y="6.5"
            width="1.6"
            height="13"
            rx="0.8"
            fill="url(#sl-bar-pink)"
          />

          {/* Top connecting beam (dynamic slope) */}
          <path
            d="M9 10.5 L21.6 7.5 L21.6 5 L9 8 Z"
            fill="url(#sl-cyan-pink)"
          />
        </g>

        {/* 2. Dynamic Audio Equalizer Bars (Multi-Colored & Dancing) */}
        <g transform="translate(19, 12)">
          {/* Equalizer Bar 1: Electric Lime */}
          <motion.rect
            x="2.5"
            width="1.7"
            rx="0.85"
            fill="url(#sl-bar-cyan)"
            animate={
              isPlaying
                ? {
                    height: [4, 11, 6, 13, 5],
                    y: [10, 3, 8, 1, 9],
                  }
                : {
                    height: 5,
                    y: 9,
                  }
            }
            transition={{
              duration: 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Equalizer Bar 2: Hot Pink */}
          <motion.rect
            x="5.5"
            width="1.7"
            rx="0.85"
            fill="url(#sl-bar-pink)"
            animate={
              isPlaying
                ? {
                    height: [11, 4, 14, 7, 10],
                    y: [3, 10, 0, 7, 4],
                  }
                : {
                    height: 8,
                    y: 6,
                  }
            }
            transition={{
              duration: 0.85,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.1,
            }}
          />

          {/* Equalizer Bar 3: Golden Amber */}
          <motion.rect
            x="8.5"
            width="1.7"
            rx="0.85"
            fill="url(#sl-bar-amber)"
            animate={
              isPlaying
                ? {
                    height: [6, 13, 5, 12, 6],
                    y: [8, 1, 9, 2, 8],
                  }
                : {
                    height: 11,
                    y: 3,
                  }
            }
            transition={{
              duration: 0.65,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />

          {/* Equalizer Bar 4: Cyber Violet */}
          <motion.rect
            x="11.5"
            width="1.7"
            rx="0.85"
            fill="url(#sl-bar-purple)"
            animate={
              isPlaying
                ? {
                    height: [9, 5, 11, 4, 8],
                    y: [5, 9, 3, 10, 6],
                  }
                : {
                    height: 6,
                    y: 8,
                  }
            }
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.15,
            }}
          />
        </g>

        {/* 3. Twinkling Sparkle / Star (Top Right of Beam) */}
        <motion.path
          d="M26 3L26.6 4.6L28.2 5.2L26.6 5.8L26 7.4L25.4 5.8L23.8 5.2L25.4 4.6Z"
          fill="#FFE500"
          animate={{
            scale: isPlaying ? [0.8, 1.3, 0.8] : [0.9, 1.1, 0.9],
            opacity: isPlaying ? [0.7, 1, 0.7] : [0.6, 0.8, 0.6],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>

      {/* Ping indicator when playing */}
      {showBadge && isPlaying && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-cyan to-neon-pink shadow-[0_0_8px_#00E5FF]" />
        </span>
      )}
    </div>
  )
}
