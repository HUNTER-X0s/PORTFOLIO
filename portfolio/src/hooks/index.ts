'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'

// ============================================================
// useSound — plays a subtle click/interaction sound
// ============================================================
export function useSound() {
  const soundEnabled = usePortfolioStore((s) => s.soundEnabled)
  const audioRef = useRef<AudioContext | null>(null)

  const playClick = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const ctx = audioRef.current || new AudioContext()
      audioRef.current = ctx
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.1)
    } catch {
      // AudioContext blocked — fail silently
    }
  }, [soundEnabled])

  const playHover = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const ctx = audioRef.current || new AudioContext()
      audioRef.current = ctx
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.setValueAtTime(600, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.03, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.06)
    } catch {
      // fail silently
    }
  }, [soundEnabled])

  return { playClick, playHover }
}

// ============================================================
// useScrollProgress — tracks page scroll 0–1 (rAF optimized)
// ============================================================
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progress
}

// ============================================================
// useActiveSection — IntersectionObserver for nav highlighting
// ============================================================
export function useActiveSection(sectionIds: string[]) {
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds, setActiveSection])
}

// ============================================================
// useCommandPalette — keyboard shortcut handler
// ============================================================
export function useCommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = usePortfolioStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, setCommandPaletteOpen])

  return { isOpen: isCommandPaletteOpen, setOpen: setCommandPaletteOpen }
}

// ============================================================
// useMousePosition — tracks mouse coordinates (rAF optimized)
// ============================================================
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY })
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return position
}

// ============================================================
// useInView — simplified IntersectionObserver hook
// ============================================================
export function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ============================================================
// useWindowSize
// ============================================================
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
