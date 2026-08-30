'use client'

import React, { useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Dynamic3DCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  intensity?: number
  glowColor?: string
  enableGlow?: boolean
  enableParallax?: boolean
  depth?: number
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function Dynamic3DCard({
  children,
  className,
  intensity = 12,
  glowColor = 'rgba(0, 229, 255, 0.22)',
  enableGlow = true,
  enableParallax = true,
  depth = 18,
  onClick,
  ...props
}: Dynamic3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const rafId = useRef<number | null>(null)
  const moveRafId = useRef<number | null>(null)
  const isInteractingRef = useRef(false)
  const rectRef = useRef<DOMRect | null>(null)

  const current = useRef({ rx: 0, ry: 0, scale: 1, tz: 0, gx: 50, gy: 50, go: 0 })
  const target = useRef({ rx: 0, ry: 0, scale: 1, tz: 0, gx: 50, gy: 50, go: 0 })
  const lastGlow = useRef({ gx: -1, gy: -1 })

  const updateCardTransform = useCallback(() => {
    if (!innerRef.current) return

    const factor = isInteractingRef.current ? 0.22 : 0.12
    const cur = current.current
    const tar = target.current

    cur.rx += (tar.rx - cur.rx) * factor
    cur.ry += (tar.ry - cur.ry) * factor
    cur.scale += (tar.scale - cur.scale) * factor
    cur.tz += (tar.tz - cur.tz) * factor
    cur.gx += (tar.gx - cur.gx) * factor
    cur.gy += (tar.gy - cur.gy) * factor
    cur.go += (tar.go - cur.go) * factor

    innerRef.current.style.transform =
      `perspective(1000px) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg) scale3d(${cur.scale.toFixed(3)}, ${cur.scale.toFixed(3)}, 1)`

    if (contentRef.current && enableParallax) {
      contentRef.current.style.transform = `translateZ(${cur.tz.toFixed(1)}px)`
    }

    if (glowRef.current && enableGlow) {
      glowRef.current.style.opacity = cur.go.toFixed(2)
      const gxRound = Math.round(cur.gx)
      const gyRound = Math.round(cur.gy)
      if (gxRound !== lastGlow.current.gx || gyRound !== lastGlow.current.gy) {
        glowRef.current.style.background =
          `radial-gradient(360px circle at ${gxRound}% ${gyRound}%, ${glowColor}, transparent 70%)`
        lastGlow.current.gx = gxRound
        lastGlow.current.gy = gyRound
      }
    }

    const delta =
      Math.abs(tar.rx - cur.rx) +
      Math.abs(tar.ry - cur.ry) +
      Math.abs(tar.scale - cur.scale) +
      Math.abs(tar.go - cur.go)

    if (isInteractingRef.current || delta > 0.015) {
      rafId.current = requestAnimationFrame(updateCardTransform)
    } else {
      rafId.current = null
      // When completely resting, release 3D transform strings to allow browser to optimize
      if (!isInteractingRef.current && innerRef.current) {
        innerRef.current.style.transform = ''
        innerRef.current.style.willChange = 'auto'
        innerRef.current.style.transformStyle = 'flat'
        if (contentRef.current) {
          contentRef.current.style.transform = ''
          contentRef.current.style.willChange = 'auto'
        }
      }
    }
  }, [enableGlow, enableParallax, glowColor])

  const startLoop = useCallback(() => {
    if (rafId.current === null) {
      if (innerRef.current) {
        innerRef.current.style.willChange = 'transform'
        innerRef.current.style.transformStyle = 'preserve-3d'
      }
      if (contentRef.current && enableParallax) {
        contentRef.current.style.willChange = 'transform'
      }
      rafId.current = requestAnimationFrame(updateCardTransform)
    }
  }, [updateCardTransform, enableParallax])

  const setCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!cardRef.current) return
      if (moveRafId.current !== null) return

      moveRafId.current = requestAnimationFrame(() => {
        moveRafId.current = null
        if (!cardRef.current) return
        if (!rectRef.current) {
          rectRef.current = cardRef.current.getBoundingClientRect()
        }
        const rect = rectRef.current
        const x = clientX - rect.left
        const y = clientY - rect.top

        const normX = Math.max(-1, Math.min(1, (x / rect.width - 0.5) * 2))
        const normY = Math.max(-1, Math.min(1, (y / rect.height - 0.5) * 2))

        target.current.rx = -normY * intensity
        target.current.ry = normX * intensity
        target.current.scale = 1.018
        target.current.tz = depth
        target.current.gx = (x / rect.width) * 100
        target.current.gy = (y / rect.height) * 100
        target.current.go = 1

        startLoop()
      })
    },
    [intensity, depth, startLoop]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setCoords(e.clientX, e.clientY)
    },
    [setCoords]
  )

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect()
      }
      isInteractingRef.current = true
      setCoords(e.clientX, e.clientY)
    },
    [setCoords]
  )

  const handleMouseLeave = useCallback(() => {
    isInteractingRef.current = false
    rectRef.current = null

    target.current.rx = 0
    target.current.ry = 0
    target.current.scale = 1
    target.current.tz = 0
    target.current.go = 0
    target.current.gx = 50
    target.current.gy = 50

    startLoop()
  }, [startLoop])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect()
      }
      isInteractingRef.current = true
      if (e.touches.length > 0) {
        setCoords(e.touches[0].clientX, e.touches[0].clientY)
      }
    },
    [setCoords]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        setCoords(e.touches[0].clientX, e.touches[0].clientY)
      }
    },
    [setCoords]
  )

  const handleTouchEnd = useCallback(() => {
    handleMouseLeave()
  }, [handleMouseLeave])

  useEffect(() => {
    const onResize = () => {
      if (cardRef.current && isInteractingRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect()
      }
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      if (moveRafId.current !== null) cancelAnimationFrame(moveRafId.current)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={onClick}
      {...(props as any)}
    >
      <div
        ref={innerRef}
        className="w-full h-full relative rounded-[inherit]"
      >
        {/* Holographic Radial Specular Glare Layer */}
        {enableGlow && (
          <div
            ref={glowRef}
            className="pointer-events-none absolute -inset-px rounded-[inherit] z-30 opacity-0"
            style={{
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          />
        )}

        {/* 3D Depth Layer */}
        <div
          ref={contentRef}
          className="w-full h-full rounded-[inherit]"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
