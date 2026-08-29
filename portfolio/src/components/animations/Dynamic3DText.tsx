'use client'

import React, { useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Dynamic3DTextProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  glowColor?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  enableDepth?: boolean
}

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function Dynamic3DText({
  children,
  className,
  intensity = 8,
  glowColor = 'rgba(0, 229, 255, 0.4)',
  as = 'div',
  enableDepth = true,
}: Dynamic3DTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)
  const moveRafId = useRef<number | null>(null)
  const isHoveredRef = useRef(false)
  const rectRef = useRef<DOMRect | null>(null)

  const current = useRef({ rx: 0, ry: 0, tz: 0 })
  const target = useRef({ rx: 0, ry: 0, tz: 0 })

  const updateTransform = useCallback(() => {
    if (!textRef.current) return

    const factor = isHoveredRef.current ? 0.22 : 0.12
    const cur = current.current
    const tar = target.current

    cur.rx += (tar.rx - cur.rx) * factor
    cur.ry += (tar.ry - cur.ry) * factor
    cur.tz += (tar.tz - cur.tz) * factor

    textRef.current.style.transform = `perspective(700px) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg) translateZ(${cur.tz.toFixed(1)}px)`

    const delta =
      Math.abs(tar.rx - cur.rx) +
      Math.abs(tar.ry - cur.ry) +
      Math.abs(tar.tz - cur.tz)

    if (isHoveredRef.current || delta > 0.015) {
      rafId.current = requestAnimationFrame(updateTransform)
    } else {
      rafId.current = null
      if (!isHoveredRef.current && textRef.current) {
        textRef.current.style.transform = ''
        textRef.current.style.willChange = 'auto'
        textRef.current.style.transformStyle = 'flat'
      }
    }
  }, [])

  const startLoop = useCallback(() => {
    if (rafId.current === null) {
      if (textRef.current) {
        textRef.current.style.willChange = 'transform'
        textRef.current.style.transformStyle = 'preserve-3d'
      }
      rafId.current = requestAnimationFrame(updateTransform)
    }
  }, [updateTransform])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (IS_TOUCH) return
      if (moveRafId.current !== null) return
      const clientX = e.clientX
      const clientY = e.clientY

      moveRafId.current = requestAnimationFrame(() => {
        moveRafId.current = null
        if (!containerRef.current) return
        if (!rectRef.current) {
          rectRef.current = containerRef.current.getBoundingClientRect()
        }
        const rect = rectRef.current
        const x = clientX - rect.left
        const y = clientY - rect.top

        const normX = Math.max(-1, Math.min(1, (x / rect.width - 0.5) * 2))
        const normY = Math.max(-1, Math.min(1, (y / rect.height - 0.5) * 2))

        target.current.rx = -normY * intensity
        target.current.ry = normX * intensity
        target.current.tz = enableDepth ? 14 : 0

        startLoop()
      })
    },
    [intensity, enableDepth, startLoop]
  )

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (IS_TOUCH) return
      if (containerRef.current) {
        rectRef.current = containerRef.current.getBoundingClientRect()
      }
      isHoveredRef.current = true
      handleMouseMove(e)
    },
    [handleMouseMove]
  )

  const handleMouseLeave = useCallback(() => {
    if (IS_TOUCH) return
    isHoveredRef.current = false
    rectRef.current = null
    target.current.rx = 0
    target.current.ry = 0
    target.current.tz = 0
    startLoop()
  }, [startLoop])

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      if (moveRafId.current !== null) cancelAnimationFrame(moveRafId.current)
    }
  }, [])

  const Tag = as as any

  return (
    <div
      ref={containerRef}
      style={{ display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={textRef}
        className={cn('select-none', className)}
      >
        <Tag className="inline-block" style={{ isolation: 'isolate' }}>
          {children}
        </Tag>
      </div>
    </div>
  )
}
