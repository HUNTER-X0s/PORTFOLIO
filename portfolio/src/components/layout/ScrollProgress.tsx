'use client'

import { useEffect, useRef } from 'react'

/**
 * High-performance ScrollProgress bar.
 * Directly animates GPU scaleX on scroll without triggering ANY React component re-renders.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number | null = null

    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        if (!barRef.current) return
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const p = docHeight > 0 ? scrollTop / docHeight : 0
        barRef.current.style.transform = `scaleX(${p})`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none origin-left will-change-transform"
      style={{
        background: 'linear-gradient(90deg, #00E5FF, #7C3AED)',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
      }}
    />
  )
}
