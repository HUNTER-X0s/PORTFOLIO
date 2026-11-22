'use client'

import React, { useMemo } from 'react'

interface ShuttleIconUIProps {
  className?: string
  isHovered?: boolean
  isActive?: boolean
}

/**
 * ShuttleIconUI
 * Faithfully crafted according to the Vivo Shuttle charging animation reference:
 * - A dense, luminous, organic electric plasma corona ring:
 *   - Upper hemisphere: Intense Electric Cyan & Sky Blue (#00F5FF, #38BDF8)
 *   - Lower hemisphere: Intense Electric Violet, Magenta & Purple (#A855F7, #E879F9, #C026D3)
 * - Aesthetic slightly dark-toned depth: Volumetric dark-toned shadow flares (#020617, #0B1220, #1E1B4B, #3B0764)
 *   counter-swirling beneath the vibrant plasma flares to create genuine 3D solar flare depth.
 * - Organic Catmull-Rom cubic-bezier smoothed prominence curves (not rigid jagged polygon teeth).
 * - Multi-frequency orbiting cosmic stardust sparks.
 * - Completely circular and hollow in the center (no square borders or masks).
 */
export default function ShuttleIconUI({ className = '', isHovered = false, isActive = false }: ShuttleIconUIProps) {
  // Generate organic plasma flame boundaries using harmonic frequencies with Catmull-Rom cubic bezier smoothing
  const { donutPath1, donutPath2, donutPath3 } = useMemo(() => {
    function generateOrganicPlasmaRing(baseR: number, variance: number, seed: number) {
      const steps = 48
      const points: { x: number; y: number }[] = []
      for (let i = 0; i < steps; i++) {
        const angle = (i * 360 / steps) * (Math.PI / 180)
        // Multi-frequency organic plasma wave harmonics
        const harmonic =
          Math.sin(angle * 7 + seed) * 0.42 +
          Math.cos(angle * 13 + seed * 1.7) * 0.36 +
          Math.sin(angle * 21 + seed * 2.3) * 0.22
        const r = baseR + variance * harmonic
        points.push({
          x: 50 + r * Math.cos(angle),
          y: 50 + r * Math.sin(angle),
        })
      }

      // Catmull-Rom to Cubic Bezier curve conversion for silky-smooth organic flames
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

    // Inner hollow circular cutout (radius 23.5) with evenodd fill rule
    const innerCutout = 'M 50, 26.5 A 23.5 23.5 0 1 0 50, 73.5 A 23.5 23.5 0 1 0 50, 26.5 Z'

    // Layer 1: Primary multicolor solar plasma corona (base radius 36, variance 6.5)
    const outerSpikes1 = generateOrganicPlasmaRing(36.5, 6.5, 1.2)
    // Layer 2: Deep dark volumetric shadow flares (base radius 35, variance 7)
    const outerSpikes2 = generateOrganicPlasmaRing(35.5, 7.0, 3.8)
    // Layer 3: Secondary soft outer coronal streamers (base radius 38, variance 5.5)
    const outerSpikes3 = generateOrganicPlasmaRing(38.0, 5.5, 5.4)

    return {
      donutPath1: `${outerSpikes1} ${innerCutout}`,
      donutPath2: `${outerSpikes2} ${innerCutout}`,
      donutPath3: `${outerSpikes3} ${innerCutout}`,
    }
  }, [])

  // Orbiting cosmic stardust sparks
  const sparks = [
    { cx: 50, cy: 6.5, r: 1.3, fill: '#00F5FF', delay: '0s' },
    { cx: 73, cy: 12.5, r: 1.5, fill: '#38BDF8', delay: '0.3s' },
    { cx: 90, cy: 30, r: 1.1, fill: '#818CF8', delay: '0.7s' },
    { cx: 94, cy: 53, r: 1.4, fill: '#C084FC', delay: '1.1s' },
    { cx: 83, cy: 80, r: 1.5, fill: '#E879F9', delay: '0.5s' },
    { cx: 57, cy: 93.5, r: 1.2, fill: '#EC4899', delay: '1.4s' },
    { cx: 34, cy: 93, r: 1.6, fill: '#A855F7', delay: '0.2s' },
    { cx: 13, cy: 79, r: 1.3, fill: '#D946EF', delay: '0.9s' },
    { cx: 6.5, cy: 55, r: 1.4, fill: '#818CF8', delay: '0.4s' },
    { cx: 9.5, cy: 28, r: 1.2, fill: '#38BDF8', delay: '1.2s' },
    { cx: 27, cy: 11, r: 1.5, fill: '#00F5FF', delay: '0.6s' },
    { cx: 64, cy: 7.5, r: 1.0, fill: '#FDE047', delay: '1.0s' },
    { cx: 87, cy: 68, r: 1.1, fill: '#F43F5E', delay: '0.8s' },
    { cx: 14, cy: 40, r: 1.2, fill: '#38BDF8', delay: '1.5s' },
  ]

  return (
    <div className={`absolute -inset-3.5 sm:-inset-4 pointer-events-none select-none flex items-center justify-center rounded-full ${className}`}>
      {/* Subtle non-intrusive ambient aura with deep cosmic dark-tone */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none ${
          isHovered || isActive ? 'opacity-40 scale-100' : 'opacity-20 scale-100'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(15, 23, 42, 0.7) 0%, rgba(0, 229, 255, 0.14) 45%, rgba(192, 38, 211, 0.1) 70%, transparent 85%)',
          filter: 'blur(4px)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{
          filter: isHovered
            ? 'drop-shadow(0 0 5px rgba(0, 229, 255, 0.5)) drop-shadow(0 0 10px rgba(192, 38, 211, 0.4))'
            : 'drop-shadow(0 0 3px rgba(0, 229, 255, 0.35)) drop-shadow(0 0 6px rgba(192, 38, 211, 0.25))',
          transition: 'filter 0.3s ease',
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Vertical Multicolor Gradient: Electric Cyan on top to Magenta/Purple on bottom */}
          <linearGradient id="shuttleMulticolorCore" x1="50" y1="4" x2="50" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.98" />
            <stop offset="22%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#818CF8" stopOpacity="0.92" />
            <stop offset="68%" stopColor="#C084FC" stopOpacity="0.95" />
            <stop offset="86%" stopColor="#E879F9" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#C026D3" stopOpacity="0.98" />
          </linearGradient>

          {/* Deep Dark-Toned Volumetric Shadow Plasma Gradient */}
          <linearGradient id="shuttleDarkShadowGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.92" />
            <stop offset="35%" stopColor="#0F172A" stopOpacity="0.88" />
            <stop offset="65%" stopColor="#1E1B4B" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#3B0764" stopOpacity="0.80" />
            <stop offset="100%" stopColor="#050814" stopOpacity="0.40" />
          </linearGradient>

          {/* Secondary Softer Multicolor Plasma Gradient with Deep Tone Accent */}
          <linearGradient id="shuttleMulticolorSoft" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.65" />
            <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#818CF8" stopOpacity="0.50" />
            <stop offset="82%" stopColor="#D946EF" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.35" />
          </linearGradient>

          {/* Native SVG Filter for ethereal plasma smoke */}
          <filter id="shuttlePlasmaBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Ambient dense plasma ring body */}
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="url(#shuttleMulticolorCore)"
          strokeWidth="6"
          opacity="0.45"
          style={{ filter: 'blur(3px)' }}
        />

        {/* ── LAYER 1: Deep Dark-Toned Volumetric Shadow Flares (Counter-Rotating) ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `shuttleSpinCounter ${isHovered ? '5s' : '8s'} linear infinite`,
          }}
        >
          <path
            d={donutPath2}
            fill="url(#shuttleDarkShadowGrad)"
            fillRule="evenodd"
            opacity="0.92"
          />
        </g>

        {/* ── LAYER 2: Secondary Soft Coronal Streamers (Blurred) ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `shuttleSpinCounter ${isHovered ? '4s' : '7s'} linear infinite`,
          }}
        >
          <path
            d={donutPath3}
            fill="url(#shuttleMulticolorSoft)"
            fillRule="evenodd"
            filter="url(#shuttlePlasmaBlur)"
            opacity="0.8"
          />
        </g>

        {/* ── LAYER 3: Primary Rotating Multicolor Electric Plasma Corona (Faithful to Image 1) ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: `shuttleSpinClockwise ${isHovered ? '3s' : '5s'} linear infinite`,
          }}
        >
          <path
            d={donutPath1}
            fill="url(#shuttleMulticolorCore)"
            fillRule="evenodd"
            stroke="#00F5FF"
            strokeWidth="0.6"
            strokeOpacity="0.8"
            opacity="0.95"
          />
        </g>

        {/* ── LAYER 4: Orbiting Constellation Celestial Sparks ── */}
        <g
          style={{
            transformOrigin: '50px 50px',
            animation: 'shuttleSpinClockwise 10s linear infinite',
          }}
        >
          {sparks.map((spark, idx) => (
            <circle
              key={idx}
              cx={spark.cx}
              cy={spark.cy}
              r={spark.r}
              fill={spark.fill}
              className="animate-pulse"
              style={{ animationDelay: spark.delay, animationDuration: '1.6s' }}
            />
          ))}
        </g>

        {/* ── LAYER 5: Inner Precision Geometric Rims Framing Center ── */}
        <circle
          cx="50"
          cy="50"
          r="23"
          stroke="url(#shuttleMulticolorCore)"
          strokeWidth="2.4"
          fill="none"
          opacity="0.95"
          style={{ filter: 'drop-shadow(0 0 3px #00F5FF)' }}
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
          stroke="#00F5FF"
          strokeWidth="0.75"
          strokeDasharray="3 5"
          fill="none"
          opacity="0.8"
          style={{
            transformOrigin: '50px 50px',
            animation: 'shuttleSpinClockwise 4s linear infinite',
          }}
        />
      </svg>
    </div>
  )
}
