'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { usePortfolioStore } from '@/store/usePortfolioStore'

export default function CustomCursor() {
  const cursorVariant = usePortfolioStore((s) => s.cursorVariant)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Outer ring — follows with spring lag
  const outerX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.5 })
  const outerY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.5 })

  // Inner dot — follows tightly
  const innerX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.1 })
  const innerY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.1 })

  const isClickRef = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const onDown = () => {
      isClickRef.current = true
      usePortfolioStore.getState().setCursorVariant('click')
    }

    const onUp = () => {
      isClickRef.current = false
      usePortfolioStore.getState().setCursorVariant('default')
    }

    const onMouseEnterInteractive = (e: Event) => {
      const target = e.target as Element
      if (target.matches('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]')) {
        if (!isClickRef.current) {
          usePortfolioStore.getState().setCursorVariant('hover')
        }
      }
    }

    const onMouseLeaveInteractive = (e: Event) => {
      const target = e.target as Element
      if (target.matches('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]')) {
        if (!isClickRef.current) {
          usePortfolioStore.getState().setCursorVariant('default')
        }
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onMouseEnterInteractive)
    document.addEventListener('mouseout', onMouseLeaveInteractive)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onMouseEnterInteractive)
      document.removeEventListener('mouseout', onMouseLeaveInteractive)
    }
  }, [mouseX, mouseY])

  const outerSize = cursorVariant === 'hover' ? 44 : cursorVariant === 'click' ? 28 : 32
  const innerSize = cursorVariant === 'click' ? 6 : 5
  const outerOpacity = cursorVariant === 'hover' ? 0.8 : 0.6
  const outerBorderColor =
    cursorVariant === 'hover'
      ? 'rgba(0, 229, 255, 0.9)'
      : cursorVariant === 'click'
      ? 'rgba(255, 107, 43, 0.9)'
      : 'rgba(0, 229, 255, 0.6)'
  const innerColor =
    cursorVariant === 'click'
      ? '#FF6B2B'
      : '#00E5FF'

  return (
    <>
      {/* Outer ring */}
      <motion.div
        id="custom-cursor-outer"
        style={{
          left: outerX,
          top: outerY,
          width: outerSize,
          height: outerSize,
          border: `1.5px solid ${outerBorderColor}`,
          opacity: outerOpacity,
          boxShadow:
            cursorVariant === 'hover'
              ? '0 0 16px rgba(0,229,255,0.4)'
              : 'none',
        }}
        animate={{ width: outerSize, height: outerSize }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-normal will-change-transform"
      />

      {/* Inner dot */}
      <motion.div
        id="custom-cursor-inner"
        style={{
          left: innerX,
          top: innerY,
          width: innerSize,
          height: innerSize,
          background: innerColor,
          boxShadow: `0 0 8px ${innerColor}`,
        }}
        animate={{ width: innerSize, height: innerSize }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed pointer-events-none z-[10000] rounded-full will-change-transform"
      />
    </>
  )
}
