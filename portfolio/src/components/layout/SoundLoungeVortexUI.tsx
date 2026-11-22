'use client'

import React, { useMemo, useId } from 'react'
import { motion } from 'framer-motion'

interface SoundLoungeVortexUIProps {
  className?: string
  isHovered?: boolean
  isActive?: boolean
  isPlaying?: boolean
}

/**
 * SoundLoungeVortexUI
 * Dynamic, interactive, multicolored acoustic vortex inspired by the ChatBot (Shuttle) & Voice Assistant (Phantom):
 * - Non-colliding central sanctuary: Clear inner radius (R=26) with SVG clipping ensures ribbons, waves, and concentric acoustic ripple rings NEVER intrude upon or collide with the middle music UI icon
 * - Bounds-disciplined: Strictly contained within its parent container (`inset-0`), ensuring it never overflows the navbar or banner
 * - Prominent, thick, luminous acoustic corona and fluid silk ribbons for high visibility
 * - High-vibrancy Multicolor: Electric Cyan, Solar Gold, Hot Magenta, Cyber Violet, and Aurora Emerald
 * - Volumetric deep-space shadow flares counter-swirling underneath for genuine 3D solar/acoustic depth
 * - Fluid acoustic silk ribbons swirling smoothly with individual chromatic gradients
 * - Concentric acoustic soundwave ripple rings pulsing outward starting from R=26 like physical soundwaves radiating from a speaker
 * - 12 orbiting cosmic musical stardust sparks
 * - Double neon inner framing rings cleanly encircling the inner core
 */
export default function SoundLoungeVortexUI({
  className = '',
  isHovered = false,
  isActive = false,
  isPlaying = false,
}: SoundLoungeVortexUIProps) {
  const isEngaged = isHovered || isActive || isPlaying
  const rawId = useId()
  const uid = useMemo(() => `slv-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`, [rawId])

  // Multi-frequency harmonic acoustic plasma wave generator with Catmull-Rom cubic bezier smoothing
  const { acousticCorona1, acousticCorona2, acousticStreamers } = useMemo(() => {
    function generateOrganicAcousticWave(baseR: number, variance: number, seed: number) {
      const steps = 48
      const points: { x: number; y: number }[] = []
      for (let i = 0; i < steps; i++) {
        const angle = (i * 360 / steps) * (Math.PI / 180)
        // Multi-frequency acoustic wave harmonics (fundamental + 2nd overtone + 3rd overtone)
        const harmonic =
          Math.sin(angle * 6 + seed) * 0.45 +
          Math.cos(angle * 12 + seed * 1.5) * 0.35 +
          Math.sin(angle * 18 + seed * 2.2) * 0.20
        const r = baseR + variance * harmonic
        points.push({
          x: 50 + r * Math.cos(angle),
          y: 50 + r * Math.sin(angle),
        })
      }

      // Catmull-Rom to Cubic Bezier curve conversion for silky-smooth organic waves
      let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
      for (let i = 0; i < steps; i++) {
        const curr = points[i]
        const next = points[(i + 1) % steps]
        const nextNext = points[(i + 2) % steps]
        const prev = points[(i - 1 + steps) % steps]

        const cp1x = curr.x + (next.x - prev.x) / 6
        const cp1y = curr.y + (next.y - prev.y) / 6
        const cp2x = next.x - (nextNext.x - curr.x) / 6
        const cp2y = next.y - (nextNext.y - curr.y) / 6

        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${next.x.toFixed(2)} ${next.y.toFixed(2)}`
      }
      return path + ' Z'
    }

    // Inner hollow circular cutout (generous radius 26) ensuring complete clearance for the middle music icon
    const innerCutout = 'M 50, 24 A 26 26 0 1 0 50, 76 A 26 26 0 1 0 50, 24 Z'

    // Prominent outer waves reaching radius 46.5 for maximum visibility while safely within 100x100 viewBox
    const outer1 = generateOrganicAcousticWave(41.5, 5.0, 1.4)
    const outer2 = generateOrganicAcousticWave(40.5, 5.5, 4.1)
    const outer3 = generateOrganicAcousticWave(42.5, 4.0, 6.7)

    return {
      acousticCorona1: `${outer1} ${innerCutout}`,
      acousticCorona2: `${outer2} ${innerCutout}`,
      acousticStreamers: `${outer3} ${innerCutout}`,
    }
  }, [])

  // 10 fluid acoustic silk ribbon petals that twist dynamically within the outer corona ring
  const silkPetals = useMemo(() => Array.from({ length: 10 }, (_, i) => (i * 360) / 10), [])

  // 12 orbiting cosmic musical sparks clearly visible at radius ~45
  const sparks = [
    { cx: 50, cy: 5, r: 1.8, fill: '#00F5FF' },
    { cx: 74, cy: 11, r: 1.9, fill: '#FFE500' },
    { cx: 92, cy: 28, r: 1.6, fill: '#FF2D9C' },
    { cx: 95, cy: 51, r: 1.9, fill: '#C084FC' },
    { cx: 85, cy: 77, r: 1.7, fill: '#00FF87' },
    { cx: 59, cy: 94, r: 1.9, fill: '#FF9F1C' },
    { cx: 33, cy: 94, r: 1.6, fill: '#F43F5E' },
    { cx: 12, cy: 77, r: 1.8, fill: '#38BDF8' },
    { cx: 5, cy: 51, r: 1.9, fill: '#E879F9' },
    { cx: 11, cy: 24, r: 1.6, fill: '#00FF87' },
    { cx: 28, cy: 9, r: 1.8, fill: '#00F5FF' },
    { cx: 66, cy: 7, r: 1.5, fill: '#FFE500' },
  ]

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none flex items-center justify-center rounded-full ${className}`}
      aria-hidden="true"
    >
      {/* Radiant ambient aura contained strictly within container bounds */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 pointer-events-none ${
          isEngaged ? 'opacity-75 scale-100' : 'opacity-30 scale-95'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(0, 245, 255, 0.4) 0%, rgba(255, 45, 156, 0.3) 40%, rgba(139, 92, 246, 0.18) 68%, transparent 82%)',
          filter: 'blur(3px)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{
          filter: isEngaged
            ? 'drop-shadow(0 0 3px rgba(0, 245, 255, 0.8)) drop-shadow(0 0 6px rgba(255, 45, 156, 0.55))'
            : 'drop-shadow(0 0 2px rgba(0, 245, 255, 0.5)) drop-shadow(0 0 4px rgba(139, 92, 246, 0.35))',
          transition: 'filter 0.3s ease',
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Circular inner clearance clip: strictly masks out the center (R < 26) so ribbons NEVER touch the middle icon */}
          <clipPath id={`${uid}-outerClip`}>
            <path
              d="M 0 0 H 100 V 100 H 0 Z M 50 24 A 26 26 0 1 0 50 76 A 26 26 0 1 0 50 24 Z"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </clipPath>

          {/* Chromatic Spectrum Gradient for Main Plasma Corona */}
          <linearGradient id={`${uid}-chromaticCorona`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.98" />
            <stop offset="25%" stopColor="#FFE500" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FF2D9C" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#A855F7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#00FF87" stopOpacity="0.95" />
          </linearGradient>

          {/* Deep Volumetric Shadow Gradient */}
          <linearGradient id={`${uid}-shadowGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#0B1220" stopOpacity="0.90" />
            <stop offset="75%" stopColor="#1E1B4B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#020408" stopOpacity="0.45" />
          </linearGradient>

          {/* Gradient 1: Electric Cyan & Azure */}
          <linearGradient id={`${uid}-cyanGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#0EA5E9" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#1E1B4B" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.4" />
          </linearGradient>

          {/* Gradient 2: Hot Magenta & Neon Pink */}
          <linearGradient id={`${uid}-pinkGrad`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF2D9C" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#F43F5E" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#831843" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#0A0F1D" stopOpacity="0.4" />
          </linearGradient>

          {/* Gradient 3: Solar Gold & Amber */}
          <linearGradient id={`${uid}-amberGrad`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE500" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#FFB703" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#FB8500" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.4" />
          </linearGradient>

          {/* Gradient 4: Radiant Lavender & Cyber Violet */}
          <linearGradient id={`${uid}-purpleGrad`} x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#8B5CF6" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#4C1D95" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#050814" stopOpacity="0.4" />
          </linearGradient>

          {/* Gradient 5: Aurora Emerald & Electric Lime */}
          <linearGradient id={`${uid}-limeGrad`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00FF87" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#10B981" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#064E3B" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.4" />
          </linearGradient>

          {/* Dual-Tone Ring Gradients */}
          <linearGradient id={`${uid}-cyanPink`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="50%" stopColor="#FF2D9C" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id={`${uid}-goldViolet`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE500" />
            <stop offset="50%" stopColor="#FF2D9C" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>

          {/* Soft blur for outer acoustic streamers */}
          <filter id={`${uid}-streamerBlur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* ── LAYER 1: Deep Volumetric Dark Shadow Flares (Counter-Swirl) ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `phantomSwirlCounter ${isEngaged ? '5s' : '10s'} linear infinite`,
          }}
        >
          <path
            d={acousticCorona2}
            fill={`url(#${uid}-shadowGrad)`}
            fillRule="evenodd"
            opacity="0.92"
          />
        </g>

        {/* ── LAYER 2: Ethereal Outer Chromatic Acoustic Streamers (Counter-Swirl with Blur) ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `phantomSwirlCounter ${isEngaged ? '4s' : '8s'} linear infinite`,
          }}
        >
          <path
            d={acousticStreamers}
            fill={`url(#${uid}-chromaticCorona)`}
            fillRule="evenodd"
            filter={`url(#${uid}-streamerBlur)`}
            opacity="0.75"
          />
        </g>

        {/* ── LAYER 3: Primary Organic Acoustic Soundwave Corona (Clockwise Swirl) ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `phantomSwirlClockwise ${isPlaying ? '2.5s' : isHovered ? '3.8s' : '7s'} linear infinite`,
          }}
        >
          <path
            d={acousticCorona1}
            fill={`url(#${uid}-chromaticCorona)`}
            fillRule="evenodd"
            stroke="#00F5FF"
            strokeWidth="0.8"
            strokeOpacity="0.85"
            opacity="0.98"
          />
        </g>

        {/* ── LAYER 4: Swirling Fluid Acoustic Silk Ribbon Petals (Masked with Outer Corona Clip so center stays 100% clean) ── */}
        <g
          clipPath={`url(#${uid}-outerClip)`}
          style={{
            transformOrigin: '50px 50px',
            animation: `phantomSwirlClockwise ${isPlaying ? '3s' : isHovered ? '4.2s' : '8s'} linear infinite`,
          }}
        >
          {silkPetals.map((angle, i) => {
            const gradId =
              i % 5 === 0
                ? `url(#${uid}-cyanGrad)`
                : i % 5 === 1
                ? `url(#${uid}-pinkGrad)`
                : i % 5 === 2
                ? `url(#${uid}-amberGrad)`
                : i % 5 === 3
                ? `url(#${uid}-purpleGrad)`
                : `url(#${uid}-limeGrad)`

            const strokeColor =
              i % 5 === 0
                ? '#00F5FF'
                : i % 5 === 1
                ? '#FF2D9C'
                : i % 5 === 2
                ? '#FFE500'
                : i % 5 === 3
                ? '#C084FC'
                : '#00FF87'

            return (
              <path
                key={`sonic-ribbon-${i}`}
                d="M 50 6 C 65 11 78 24 74 41 C 70 49 58 45 53 36 C 48 28 56 16 50 6 Z"
                transform={`rotate(${angle} 50 50)`}
                fill={gradId}
                stroke={strokeColor}
                strokeWidth="0.85"
                strokeOpacity="0.85"
                opacity="0.94"
              />
            )
          })}
        </g>

        {/* ── LAYER 5: Concentric Acoustic Soundwave Ripple Rings (Radiating OUTWARD from R=26 with ZERO collision with the middle icon) ── */}
        {isEngaged && (
          <g>
            <motion.circle
              cx="50"
              cy="50"
              r="26"
              stroke={`url(#${uid}-cyanPink)`}
              fill="none"
              initial={{ r: 26, opacity: 0.85, strokeWidth: 1.8 }}
              animate={{ r: [26, 43], opacity: [0.85, 0], strokeWidth: [1.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="26"
              stroke={`url(#${uid}-goldViolet)`}
              fill="none"
              initial={{ r: 26, opacity: 0.75, strokeWidth: 1.5 }}
              animate={{ r: [26, 46.5], opacity: [0.75, 0], strokeWidth: [1.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.9, ease: 'easeOut' }}
            />
          </g>
        )}

        {/* ── LAYER 6: Orbiting Cosmic Musical Stardust Sparks ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `phantomSwirlClockwise ${isEngaged ? '4s' : '9s'} linear infinite`,
          }}
        >
          {sparks.map((spark, i) => (
            <circle
              key={`sonic-spark-${i}`}
              cx={spark.cx}
              cy={spark.cy}
              r={spark.r}
              fill={spark.fill}
              style={{
                filter: `drop-shadow(0 0 2.5px ${spark.fill})`,
                opacity: isEngaged ? 0.98 : 0.8,
                transition: 'opacity 0.3s ease',
              }}
            />
          ))}
        </g>

        {/* ── LAYER 7: Inner Neon Framing Rings & Dark Cosmic Core (Clean, protected sanctuary for middle icon) ── */}
        {/* Dark cosmic glass disc ensuring the center is 100% pristine with zero ribbon/wave intrusion */}
        <circle
          cx="50"
          cy="50"
          r="25.5"
          fill="#040714"
          fillOpacity="0.96"
        />
        {/* Outer vibrant neon framing ring cleanly encircling the inner core */}
        <circle
          cx="50"
          cy="50"
          r="26"
          stroke={`url(#${uid}-cyanPink)`}
          strokeWidth="2.0"
          fill="none"
          opacity="0.96"
          style={{ filter: 'drop-shadow(0 0 4px #00F5FF)' }}
        />
        {/* Counter-swirling dashed accent ring */}
        <circle
          cx="50"
          cy="50"
          r="27.2"
          stroke="#FFE500"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          fill="none"
          opacity="0.85"
          style={{
            transformOrigin: '50px 50px',
            animation: 'phantomSwirlCounter 5s linear infinite',
          }}
        />
      </svg>
    </div>
  )
}
