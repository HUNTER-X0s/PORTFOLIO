'use client'

import React from 'react'

interface PhantomIconUIProps {
  className?: string
  isHovered?: boolean
  isActive?: boolean
}

/**
 * PhantomIconUI
 * Inspired by the Phantom charging animation:
 * - Fluid silk ribbon vortex with swirling, twisting curved waves
 * - Vibrant Multicolor: Electric cyan, azure, royal violet, vivid magenta, and neon rose
 * - Aesthetic Slightly Dark-Toned Depth: Deep midnight navy, obsidian, deep plum, and dark indigo shadow folds
 * - Dual-layer swirling dynamics with ethereal silk wisps and high-contrast volumetric depth
 * - Clean vector geometry with zero square bounding artifacts
 */
export default function PhantomIconUI({ className = '', isHovered = false, isActive = false }: PhantomIconUIProps) {
  // 12 radially arranged curved ribbon petals forming the fluid silk vortex around (50, 50)
  const petals = Array.from({ length: 12 }, (_, i) => i * 30)

  return (
    <div className={`absolute -inset-3.5 sm:-inset-4 pointer-events-none select-none flex items-center justify-center rounded-full ${className}`}>
      {/* Subtle non-intrusive ambient aura */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none ${
          isHovered || isActive ? 'opacity-35 scale-100' : 'opacity-15 scale-100'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, rgba(139, 92, 246, 0.08) 60%, transparent 75%)',
          filter: 'blur(4px)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{
          filter: isHovered || isActive
            ? 'drop-shadow(0 0 4px rgba(0, 229, 255, 0.45)) drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))'
            : 'drop-shadow(0 0 3px rgba(0, 229, 255, 0.35)) drop-shadow(0 0 6px rgba(124, 58, 237, 0.2))',
          transition: 'filter 0.3s ease',
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient 1: Electric Cyan into Deep Dark Indigo & Obsidian Shadow */}
          <linearGradient id="phantomDarkSilk1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.98" />
            <stop offset="25%" stopColor="#0EA5E9" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#1E1B4B" stopOpacity="0.90" />
            <stop offset="80%" stopColor="#0B0F19" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.45" />
          </linearGradient>

          {/* Gradient 2: Radiant Lavender & Electric Violet into Deep Dark Plum */}
          <linearGradient id="phantomDarkSilk2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.96" />
            <stop offset="26%" stopColor="#8B5CF6" stopOpacity="0.90" />
            <stop offset="55%" stopColor="#3B0764" stopOpacity="0.88" />
            <stop offset="82%" stopColor="#1A0B2E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0A0F1D" stopOpacity="0.40" />
          </linearGradient>

          {/* Gradient 3: Neon Rose & Vivid Magenta into Deep Dark Wine & Teal Shadow */}
          <linearGradient id="phantomDarkSilk3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#EC4899" stopOpacity="0.90" />
            <stop offset="58%" stopColor="#831843" stopOpacity="0.88" />
            <stop offset="82%" stopColor="#083344" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.30" />
          </linearGradient>

          {/* Gradient 4: Bright Electric Azure into Deep Midnight Sapphire & Void */}
          <linearGradient id="phantomDarkSilk4" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#6366F1" stopOpacity="0.92" />
            <stop offset="58%" stopColor="#1E1B4B" stopOpacity="0.88" />
            <stop offset="85%" stopColor="#050814" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.35" />
          </linearGradient>

          {/* Deep Dark-Toned Shadow Gradient for Volumetric Depth */}
          <linearGradient id="phantomShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.92" />
            <stop offset="45%" stopColor="#0F172A" stopOpacity="0.88" />
            <stop offset="80%" stopColor="#1E1B4B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#020408" stopOpacity="0.30" />
          </linearGradient>

          {/* Tertiary Ethereal Dark/Multicolor Mist Gradient */}
          <linearGradient id="phantomMistGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.65" />
            <stop offset="35%" stopColor="#8B5CF6" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#1E1B4B" stopOpacity="0.50" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.25" />
          </linearGradient>

          {/* Native SVG Filter for ethereal silk blur */}
          <filter id="phantomSilkBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Ambient background energy smoke with dark-toned rim */}
        <circle
          cx="50"
          cy="50"
          r="29"
          stroke="url(#phantomMistGrad)"
          strokeWidth="6"
          opacity="0.35"
          style={{ filter: 'blur(3px)' }}
        />

        {/* ── LAYER 1: Deep Dark-Toned Volumetric Shadow Ribbons (Counter-Swirl) ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `phantomSwirlCounter ${isActive ? '6s' : isHovered ? '8s' : '12s'} linear infinite`,
          }}
        >
          {petals.map((angle, i) => (
            <path
              key={`phantom-shadow-${i}`}
              d="M 50 11 C 63 15 73 28 69 41 C 66 48 56 44 52 37 C 49 31 55 21 50 11 Z"
              transform={`rotate(${angle + 12} 50 50)`}
              fill="url(#phantomShadowGrad)"
              opacity="0.88"
            />
          ))}
        </g>

        {/* ── LAYER 2: Ethereal Multicolor Silk Mist Layer (Counter-Swirl with Blur) ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `phantomSwirlCounter ${isActive ? '5s' : isHovered ? '7s' : '10s'} linear infinite`,
          }}
        >
          {petals.map((angle, i) => (
            <path
              key={`phantom-mist-${i}`}
              d="M 50 10 C 64 14 74 27 70 40 C 67 47 57 43 53 36 C 50 30 56 20 50 10 Z"
              transform={`rotate(${angle + 18} 50 50)`}
              fill={i % 2 === 0 ? 'url(#phantomDarkSilk2)' : 'url(#phantomDarkSilk3)'}
              filter="url(#phantomSilkBlur)"
              opacity="0.75"
            />
          ))}
        </g>

        {/* ── LAYER 3: Primary Swirling Vibrant Multicolor + Dark-Toned Ribbons ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `phantomSwirlClockwise ${isActive ? '3.5s' : isHovered ? '4.5s' : '7.5s'} linear infinite`,
          }}
        >
          {petals.map((angle, i) => {
            // Cycle through the 4 vibrant + dark-toned gradient palettes
            const gradId =
              i % 4 === 0
                ? 'url(#phantomDarkSilk1)'
                : i % 4 === 1
                ? 'url(#phantomDarkSilk2)'
                : i % 4 === 2
                ? 'url(#phantomDarkSilk3)'
                : 'url(#phantomDarkSilk4)'

            const strokeColor =
              i % 4 === 0
                ? '#00F5FF'
                : i % 4 === 1
                ? '#C084FC'
                : i % 4 === 2
                ? '#F43F5E'
                : '#38BDF8'

            return (
              <path
                key={`phantom-ribbon-${i}`}
                d="M 50 8 C 65 12 75 25 72 41 C 69 48 58 45 54 37 C 51 30 57 18 50 8 Z"
                transform={`rotate(${angle} 50 50)`}
                fill={gradId}
                stroke={strokeColor}
                strokeWidth="0.65"
                strokeOpacity="0.8"
                opacity="0.95"
              />
            )
          })}
        </g>

        {/* ── LAYER 4: Inner High-Intensity Rim Framing the Dark Core ── */}
        <circle
          cx="50"
          cy="50"
          r="23"
          stroke="url(#phantomDarkSilk1)"
          strokeWidth="2.4"
          fill="none"
          opacity="0.95"
          style={{ filter: 'drop-shadow(0 0 4px #00F5FF)' }}
        />
        <circle
          cx="50"
          cy="50"
          r="24"
          stroke="#0F172A"
          strokeWidth="1.2"
          fill="none"
          opacity="0.9"
        />
        <circle
          cx="50"
          cy="50"
          r="24.5"
          stroke="#A855F7"
          strokeWidth="0.8"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.8"
          style={{
            transformOrigin: '50px 50px',
            animation: 'phantomSwirlCounter 5s linear infinite',
          }}
        />
      </svg>
    </div>
  )
}
