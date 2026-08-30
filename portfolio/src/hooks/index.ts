'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'

// ============================================================
// useSound — plays a subtle click/interaction sound (Singleton AudioContext)
// ============================================================
let sharedAudioCtx: AudioContext | null = null
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!sharedAudioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) sharedAudioCtx = new AudioCtx()
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {})
    }
    return sharedAudioCtx
  } catch {
    return null
  }
}

export function useSound() {
  const soundEnabled = usePortfolioStore((s) => s.soundEnabled)

  const playClick = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
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
      const ctx = getAudioContext()
      if (!ctx) return
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
  const playJarvisChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'triangle'

      // Harmonic futuristic boot chime (D5 -> A5, D6 -> A6)
      osc1.frequency.setValueAtTime(587.33, now)
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12)

      osc2.frequency.setValueAtTime(1174.66, now)
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.16)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.35)
      osc2.stop(now + 0.35)
    } catch {}
  }, [soundEnabled])

  const playJarvisPulse = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.12)
    } catch {}
  }, [soundEnabled])

  return { playClick, playHover, playJarvisChime, playJarvisPulse }
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
    // Keep a map of which sections are intersecting our view band
    const visibleSections = new Map<string, boolean>()

    const observer = new IntersectionObserver(
      (entries) => {
        // Update the visibility state for all entries that changed
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.isIntersecting)
        })

        // Always pick the first section from our ordered array that is currently visible.
        // This prevents race conditions and handles browser scroll restoration perfectly.
        const currentActive = sectionIds.find((id) => visibleSections.get(id))
        
        if (currentActive) {
          setActiveSection(currentActive)
        }
      },
      // Creates a 20% high band in the middle of the screen to detect the active section
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
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
    // On mobile screens, disable scroll animations by forcing them to be visible immediately
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setInView(true)
      return
    }

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
