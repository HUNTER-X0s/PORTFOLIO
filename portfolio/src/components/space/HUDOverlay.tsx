'use client'

import { useEffect, useRef } from 'react'

// ✦ Stardust Cursor Particle Trail ✦
export default function HUDOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number; lightness?: number }>>([])
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      for (let i = 0; i < 2; i++) {
        const a = Math.random() * Math.PI * 2
        const s = Math.random() * 0.9 + 0.2
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 4,
          y: e.clientY + (Math.random() - 0.5) * 4,
          vx: Math.cos(a) * s * 0.5,
          vy: Math.sin(a) * s * 0.5,
          life: 1,
          maxLife: 0.5 + Math.random() * 0.4,
          size: Math.random() * 1.6 + 0.5,
          // Multi-spectrum celestial stardust: gold, rose, emerald, violet, solar amber, diamond white
          hue: [42, 340, 155, 275, 25, 210][Math.floor(Math.random() * 6)] + (Math.random() * 16 - 8),
          lightness: Math.random() < 0.25 ? 95 : 75 + Math.random() * 15,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0)
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96
        p.life -= 0.016 / p.maxLife
        const a = Math.max(0, p.life)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
        g.addColorStop(0, `hsla(${p.hue}, 95%, ${p.lightness || 80}%, ${a * 0.70})`)
        g.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`)
        ctx.fillStyle = g
        ctx.fill()
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  )
}