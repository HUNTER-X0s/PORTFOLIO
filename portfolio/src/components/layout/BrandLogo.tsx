'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface BrandLogoProps {
  size?: number
  className?: string
  showAura?: boolean
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 36,
  className = '',
  showAura = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none group/logo ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. Ambient Dynamic Cyber Reactive Aura */}
      {showAura && (
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan via-purple-500 to-pink-500 opacity-40 blur-md transition-all duration-500 group-hover/logo:opacity-85 group-hover/logo:blur-lg group-hover/logo:scale-110 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* 2. Main Logo Container with Smooth Tilt & Lift */}
      <motion.div
        className="relative w-full h-full rounded-[26%] overflow-hidden bg-[#040714] border border-cyan/30 shadow-[0_0_16px_rgba(0,245,255,0.25)] transition-all duration-300 group-hover/logo:border-cyan/70 group-hover/logo:shadow-[0_0_24px_rgba(0,245,255,0.55)]"
        whileHover={{ scale: 1.06, rotate: 1.5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {/* Animated Light Sweep Shimmer on Hover */}
        <div
          className="absolute inset-0 -translate-x-full group-hover/logo:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20"
          aria-hidden="true"
        />

        {/* High-Definition SVG Monogram */}
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full relative z-10 block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dark Obsidian Glass Gradient */}
            <linearGradient id="blBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1226" />
              <stop offset="45%" stopColor="#050817" />
              <stop offset="100%" stopColor="#020308" />
            </linearGradient>

            {/* Glowing Border Perimeter Gradient */}
            <linearGradient id="blBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5FF" />
              <stop offset="35%" stopColor="#3B82F6" />
              <stop offset="70%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            {/* Left Wing Gradient (Electric Cyan to Cobalt) */}
            <linearGradient id="blLeftWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0FFFF" />
              <stop offset="20%" stopColor="#00F5FF" />
              <stop offset="70%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Right Wing Gradient (Neon Purple to Cyber Pink) */}
            <linearGradient id="blRightWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#C084FC" />
              <stop offset="65%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            {/* Facet Sheen Highlights */}
            <linearGradient id="blBevelLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#00F5FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="blBevelRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </linearGradient>

            {/* Laser Bridge Beam Gradient */}
            <linearGradient id="blLaserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F5FF" stopOpacity="0" />
              <stop offset="25%" stopColor="#00F5FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="75%" stopColor="#A855F7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </linearGradient>

            {/* Core Reactor Aura */}
            <radialGradient id="blCoreAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="35%" stopColor="#00F5FF" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#7C3AED" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00F5FF" stopOpacity="0" />
            </radialGradient>

            {/* Inner Nebula */}
            <radialGradient id="blNebula" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.32" />
              <stop offset="45%" stopColor="#7C3AED" stopOpacity="0.22" />
              <stop offset="85%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>

            {/* Glow Filter */}
            <filter id="blGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep Obsidian Background */}
          <rect width="512" height="512" fill="url(#blBgGrad)" />

          {/* Glowing Radial Nebula Interior */}
          <rect width="512" height="512" fill="url(#blNebula)" />

          {/* Decorative Corner Tech Brackets */}
          <path
            d="M 96 68 L 74 68 C 65 68 60 73 60 82 L 60 104"
            stroke="#00F5FF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M 416 68 L 438 68 C 447 68 452 73 452 82 L 452 104"
            stroke="#EC4899"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          <path
            d="M 60 408 L 60 430 C 60 439 65 444 74 444 L 96 444"
            stroke="#00F5FF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          <path
            d="M 452 408 L 452 430 C 452 439 447 444 438 444 L 416 444"
            stroke="#7C3AED"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />

          {/* Ambient Glow behind Monogram Wings */}
          <path
            d="M 242 104 L 124 384 L 186 384 L 216 316 L 242 316 Z"
            fill="#00F5FF"
            opacity="0.35"
            filter="url(#blGlow)"
          />
          <path
            d="M 270 104 L 388 384 L 326 384 L 296 316 L 270 316 Z"
            fill="#8B5CF6"
            opacity="0.35"
            filter="url(#blGlow)"
          />

          {/* Left Wing (Electric Cyan Cyber Blade) */}
          <path
            d="M 242 102 L 124 384 C 122 389 126 394 132 394 L 186 394 C 192 394 197 390 200 384 L 223 328 L 242 328 Z"
            fill="url(#blLeftWing)"
          />
          {/* Left Wing Highlight Bevel */}
          <path
            d="M 242 102 L 124 384 L 138 384 L 242 136 Z"
            fill="url(#blBevelLeft)"
          />

          {/* Right Wing (Quantum Violet/Pink Blade) */}
          <path
            d="M 270 102 L 388 384 C 390 389 386 394 380 394 L 326 394 C 320 394 315 390 312 384 L 289 328 L 270 328 Z"
            fill="url(#blRightWing)"
          />
          {/* Right Wing Highlight Bevel */}
          <path
            d="M 270 102 L 388 384 L 374 384 L 270 136 Z"
            fill="url(#blBevelRight)"
          />

          {/* Inner Negative-space Tech Guide */}
          <path
            d="M 234 290 L 256 238 L 278 290"
            stroke="#00F5FF"
            strokeWidth="2.5"
            strokeOpacity="0.45"
            fill="none"
          />

          {/* Horizontal Quantum Energy Laser Beam (Crossbar of the "A") */}
          <polygon
            points="156,286 356,286 346,298 166,298"
            fill="url(#blLaserBeam)"
            opacity="0.95"
            filter="url(#blGlow)"
          />
          <line
            x1="136"
            y1="292"
            x2="376"
            y2="292"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeOpacity="0.9"
            filter="url(#blGlow)"
          />

          {/* Central Reactor Core Aura */}
          <circle cx="256" cy="292" r="32" fill="url(#blCoreAura)" />

          {/* Central Faceted Quantum Nexus Diamond */}
          <polygon
            points="256,266 280,292 256,318 232,292"
            fill="#050818"
            stroke="#00F5FF"
            strokeWidth="3.5"
          />
          <polygon
            points="256,272 272,292 256,312 240,292"
            fill="url(#blBorderGrad)"
          />
          <polygon
            points="256,278 265,292 256,306 247,292"
            fill="#FFFFFF"
            filter="url(#blGlow)"
          />

          {/* Horizontal Quantum Emitter Nodes */}
          <circle cx="214" cy="292" r="3.5" fill="#00F5FF" filter="url(#blGlow)" />
          <circle cx="298" cy="292" r="3.5" fill="#EC4899" filter="url(#blGlow)" />

          {/* Apex Photonic Flare (North Star Burst at Crown) */}
          <circle cx="256" cy="104" r="16" fill="url(#blCoreAura)" />
          <ellipse
            cx="256"
            cy="104"
            rx="30"
            ry="4.5"
            fill="#FFFFFF"
            filter="url(#blGlow)"
          />
          <ellipse
            cx="256"
            cy="104"
            rx="4.5"
            ry="30"
            fill="#FFFFFF"
            filter="url(#blGlow)"
          />
          <circle cx="256" cy="104" r="4" fill="#FFFFFF" />
        </svg>

        {/* High-Precision Glassmorphic Rim Sheen */}
        <div
          className="absolute inset-0 rounded-[24%] border border-white/20 pointer-events-none z-10"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  )
}

export default BrandLogo
