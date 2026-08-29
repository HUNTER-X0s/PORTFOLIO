'use client'

import { useEffect, useRef } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'

/**
 * CustomCursor — High-performance, rock-solid custom cursor.
 * - Stable event listeners with zero re-attachment cycles
 * - Direct hardware-accelerated 3D transforms (translate3d)
 * - Beautiful neon cyan glow ring with dynamic hover expansion
 */
export default function CustomCursor() {
  const cursorVariant = usePortfolioStore((s) => s.cursorVariant)

  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const isClickRef = useRef(false)

  const outer = useRef({ x: -100, y: -100 })
  const inner = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const rafId = useRef<number | null>(null)
  const visibleRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const updateCursor = () => {
      const tx = target.current.x
      const ty = target.current.y

      // Outer ring: smooth trailing lerp
      outer.current.x += (tx - outer.current.x) * 0.28
      outer.current.y += (ty - outer.current.y) * 0.28

      // Inner dot: snappy tracking
      inner.current.x += (tx - inner.current.x) * 0.85
      inner.current.y += (ty - inner.current.y) * 0.85

      if (outerRef.current) {
        outerRef.current.style.transform =
          `translate3d(${outer.current.x.toFixed(1)}px, ${outer.current.y.toFixed(1)}px, 0) translate(-50%, -50%)`
      }
      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate3d(${inner.current.x.toFixed(1)}px, ${inner.current.y.toFixed(1)}px, 0) translate(-50%, -50%)`
      }

      const dist =
        Math.abs(tx - outer.current.x) +
        Math.abs(ty - outer.current.y)

      if (dist > 0.1) {
        rafId.current = requestAnimationFrame(updateCursor)
      } else {
        rafId.current = null
      }
    }

    const startLoop = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateCursor)
      }
    }

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY

      if (!visibleRef.current) {
        visibleRef.current = true
        if (outerRef.current) outerRef.current.style.opacity = '1'
        if (innerRef.current) innerRef.current.style.opacity = '1'
      }
      startLoop()
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
      const t = e.target as Element | null
      if (t?.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]')) {
        if (!isClickRef.current) usePortfolioStore.getState().setCursorVariant('hover')
      }
    }

    const onMouseLeaveInteractive = (e: Event) => {
      const t = e.target as Element | null
      if (t?.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]')) {
        if (!isClickRef.current) usePortfolioStore.getState().setCursorVariant('default')
      }
    }

    const onLeave = () => {
      visibleRef.current = false
      if (outerRef.current) outerRef.current.style.opacity = '0'
      if (innerRef.current) innerRef.current.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('mouseup', onUp, { passive: true })
    document.addEventListener('mouseover', onMouseEnterInteractive, { passive: true })
    document.addEventListener('mouseout', onMouseLeaveInteractive, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onMouseEnterInteractive)
      document.removeEventListener('mouseout', onMouseLeaveInteractive)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, []) // Empty dependency array ensures listeners are never torn down

  const outerSize = cursorVariant === 'hover' ? 46 : cursorVariant === 'click' ? 26 : 34
  const innerSize = cursorVariant === 'click' ? 6 : 5
  const outerBorderColor =
    cursorVariant === 'hover'
      ? 'rgba(0, 229, 255, 0.95)'
      : cursorVariant === 'click'
      ? 'rgba(255, 107, 43, 0.95)'
      : 'rgba(0, 229, 255, 0.75)'
  const innerColor = cursorVariant === 'click' ? '#FF6B2B' : '#00E5FF'

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        id="custom-cursor-outer"
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full will-change-transform opacity-0"
        style={{
          width: outerSize,
          height: outerSize,
          border: `1.5px solid ${outerBorderColor}`,
          boxShadow: cursorVariant === 'hover'
            ? '0 0 20px rgba(0,229,255,0.6), inset 0 0 10px rgba(0,229,255,0.2)'
            : '0 0 10px rgba(0,229,255,0.3)',
          transition: 'width 0.15s ease, height 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease',
        }}
      />

      {/* Inner dot */}
      <div
        ref={innerRef}
        id="custom-cursor-inner"
        className="fixed top-0 left-0 pointer-events-none z-[100000] rounded-full will-change-transform opacity-0"
        style={{
          width: innerSize,
          height: innerSize,
          background: innerColor,
          boxShadow: `0 0 10px ${innerColor}, 0 0 20px ${innerColor}`,
          transition: 'width 0.12s ease, height 0.12s ease, background 0.12s ease, opacity 0.2s ease',
        }}
      />
    </>
  )
}
