'use client'

import React, { useRef, useEffect } from 'react'

interface SpaceFlightWrapperProps {
  children: React.ReactNode
}

/**
 * SpaceFlightWrapper
 * Renders the portfolio content inside an authentic 3D zero-gravity space flight perspective rig.
 * Gives typography, cards, and UI elements the tactile feeling of floating weightlessly in space
 * in the forward direction towards the viewer, with organic breathing and interactive depth parallax.
 */
export default function SpaceFlightWrapper({ children }: SpaceFlightWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetTransform = useRef({ rx: 0, ry: 0, tz: 12, ty: 0 })
  const currentTransform = useRef({ rx: 0, ry: 0, tz: 12, ty: 0 })
  const scrollVelocity = useRef(0)
  const lastScrollY = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    // Only run on client with mouse / pointer
    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 + 1
      mouseRef.current.x = normX
      mouseRef.current.y = normY
    }

    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current
      lastScrollY.current = currentY
      // Velocity with clamp
      scrollVelocity.current = Math.max(-18, Math.min(18, delta * 0.4))
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    let startTime = performance.now()

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000

      // Natural zero-gravity floating oscillation in forward direction (Z) and vertical (Y)
      const forwardFloatZ = 12 + Math.sin(elapsed * 0.8) * 8 // oscillates 4px to 20px forward
      const zeroGBobY = Math.cos(elapsed * 0.6) * 5

      // Decay scroll velocity push
      scrollVelocity.current *= 0.92
      const scrollForwardPush = Math.abs(scrollVelocity.current) * 0.8

      // Target calculations with subtle pitch/yaw
      targetTransform.current.rx = -mouseRef.current.y * 1.6 + (scrollVelocity.current * 0.08)
      targetTransform.current.ry = mouseRef.current.x * 2.2
      targetTransform.current.tz = forwardFloatZ + scrollForwardPush
      targetTransform.current.ty = zeroGBobY

      // Smooth RAF lerp
      const factor = 0.06
      const c = currentTransform.current
      const t = targetTransform.current

      c.rx += (t.rx - c.rx) * factor
      c.ry += (t.ry - c.ry) * factor
      c.tz += (t.tz - c.tz) * factor
      c.ty += (t.ty - c.ty) * factor

      if (innerRef.current) {
        innerRef.current.style.transform = `rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) translateZ(${c.tz.toFixed(1)}px) translateY(${c.ty.toFixed(1)}px)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="space-flight-stage w-full"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 30%',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        ref={innerRef}
        className="space-flight-carrier w-full"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
