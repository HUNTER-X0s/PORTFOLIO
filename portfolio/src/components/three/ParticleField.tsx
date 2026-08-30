'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ── PROCEDURAL CIRCULAR SOFT-GLOW TEXTURES ──────────────────────
function useCosmicTextures() {
  return useMemo(() => {
    if (typeof document === 'undefined') return { star: null, glowingPoint: null, starburst: null, nebula: null }

    // 1. Soft Circular Star Texture
    const starCanvas = document.createElement('canvas')
    starCanvas.width = 64
    starCanvas.height = 64
    const sCtx = starCanvas.getContext('2d')
    if (sCtx) {
      const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.2, 'rgba(235, 245, 255, 0.85)')
      grad.addColorStop(0.5, 'rgba(140, 200, 255, 0.25)')
      grad.addColorStop(0.85, 'rgba(80, 140, 255, 0.04)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      sCtx.fillStyle = grad
      sCtx.fillRect(0, 0, 64, 64)
    }
    const starTex = new THREE.CanvasTexture(starCanvas)

    // 2. Point-Sized Radiant Glowing Dot Texture (Crisp white center + intense neon aura)
    const gpCanvas = document.createElement('canvas')
    gpCanvas.width = 64
    gpCanvas.height = 64
    const gpCtx = gpCanvas.getContext('2d')
    if (gpCtx) {
      const grad = gpCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)')
      grad.addColorStop(0.45, 'rgba(220, 240, 255, 0.75)')
      grad.addColorStop(0.75, 'rgba(100, 200, 255, 0.25)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      gpCtx.fillStyle = grad
      gpCtx.fillRect(0, 0, 64, 64)
    }
    const gpTex = new THREE.CanvasTexture(gpCanvas)

    // 3. Starburst with 4-Ray Cross-Diffraction Spikes (Hubble/JWST style)
    const sbCanvas = document.createElement('canvas')
    sbCanvas.width = 128
    sbCanvas.height = 128
    const sbCtx = sbCanvas.getContext('2d')
    if (sbCtx) {
      const grad = sbCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.18, 'rgba(200, 235, 255, 0.8)')
      grad.addColorStop(0.5, 'rgba(100, 160, 255, 0.18)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      sbCtx.fillStyle = grad
      sbCtx.fillRect(0, 0, 128, 128)

      // Horizontal & vertical fine diffraction spikes
      sbCtx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
      sbCtx.lineWidth = 1.2
      sbCtx.beginPath()
      sbCtx.moveTo(4, 64); sbCtx.lineTo(124, 64)
      sbCtx.moveTo(64, 4); sbCtx.lineTo(64, 124)
      sbCtx.stroke()
    }
    const sbTex = new THREE.CanvasTexture(sbCanvas)

    // 4. Ethereal Volumetric Nebula Gas Texture
    const nebCanvas = document.createElement('canvas')
    nebCanvas.width = 128
    nebCanvas.height = 128
    const nCtx = nebCanvas.getContext('2d')
    if (nCtx) {
      const grad = nCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
      grad.addColorStop(0.4, 'rgba(160, 130, 255, 0.15)')
      grad.addColorStop(0.75, 'rgba(60, 200, 255, 0.04)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      nCtx.fillStyle = grad
      nCtx.fillRect(0, 0, 128, 128)
    }
    const nebTex = new THREE.CanvasTexture(nebCanvas)

    return { star: starTex, glowingPoint: gpTex, starburst: sbTex, nebula: nebTex }
  }, [])
}

// ── 1a. ULTRA-DENSE MILKY WAY DEEP-SPACE FIELD (Millions of stars effect) ──
function DeepFieldStars({ count = 18000, texture }: { count?: number; texture: THREE.Texture | null }) {
  const mesh = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    // True astrophysical star spectral classes (O, B, A, F, G, K, M)
    const palette = [
      { c: new THREE.Color('#FFFFFF'), w: 45 }, // A-type white
      { c: new THREE.Color('#D8ECFF'), w: 25 }, // B-type blue-white
      { c: new THREE.Color('#99CCFF'), w: 12 }, // O-type deep blue
      { c: new THREE.Color('#FFF4E8'), w: 10 }, // F-type pale warm
      { c: new THREE.Color('#FFE0B2'), w: 5 },  // G/K-type amber
      { c: new THREE.Color('#B8A9FF'), w: 3 },  // Lavender dwarf
    ]
    const totalWeight = palette.reduce((s, p) => s + p.w, 0)

    const pickColor = () => {
      let r = Math.random() * totalWeight
      for (const p of palette) { r -= p.w; if (r <= 0) return p.c }
      return palette[0].c
    }

    for (let i = 0; i < count; i++) {
      // 60% of stars form a rich galactic plane / Milky Way belt across the screen
      const inGalacticBelt = Math.random() < 0.6
      let x, y, z

      if (inGalacticBelt) {
        const spreadX = (Math.random() - 0.5) * 75
        const beltY = Math.sin(spreadX * 0.05) * 8 + (Math.random() - 0.5) * 14
        const distZ = -10 - Math.random() * 45
        x = spreadX
        y = beltY
        z = distZ
      } else {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = 25 + Math.random() * 45
        x = r * Math.sin(phi) * Math.cos(theta)
        y = r * Math.sin(phi) * Math.sin(theta) * 0.7
        z = r * Math.cos(phi) - 15
      }

      pos[i * 3]     = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      const color = pickColor()
      const brightness = 0.15 + Math.random() * 0.65
      col[i * 3]     = Math.min(color.r * brightness, 1)
      col[i * 3 + 1] = Math.min(color.g * brightness, 1)
      col[i * 3 + 2] = Math.min(color.b * brightness, 1)
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = t * 0.0008
    mesh.current.rotation.x = t * 0.0004
    mesh.current.position.z = (t * 0.7) % 20 - 10
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        map={texture || undefined}
        vertexColors
        transparent
        opacity={0.82}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── 1b. MID-FIELD TWINKLING CELESTIAL STARS ───────────────────────
function TwinklingStars({ count = 4000, texture }: { count?: number; texture: THREE.Texture | null }) {
  const mesh = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#D0E8FF'),
      new THREE.Color('#FFE4C4'),
      new THREE.Color('#B8A9FF'),
      new THREE.Color('#00E5FF'),
      new THREE.Color('#FF2D9C'),
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 65
      pos[i * 3 + 1] = (Math.random() - 0.5) * 48
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15

      const color = palette[Math.floor(Math.random() * palette.length)]
      const b = 0.35 + Math.random() * 0.65
      col[i * 3]     = Math.min(color.r * b, 1)
      col[i * 3 + 1] = Math.min(color.g * b, 1)
      col[i * 3 + 2] = Math.min(color.b * b, 1)
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = mouse.x * 0.04 + t * 0.0015
    mesh.current.rotation.x = -mouse.y * 0.025 + t * 0.0006

    const mat = mesh.current.material as THREE.PointsMaterial
    mat.opacity = 0.62 + Math.sin(t * 2.2) * 0.15
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        map={texture || undefined}
        vertexColors
        transparent
        opacity={0.68}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── 1c. STARBURST FOCAL STARS (4-Point Diffraction Glints) ────────
function StarburstFocalStars({ count = 160, texture }: { count?: number; texture: THREE.Texture | null }) {
  const mesh = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#00E5FF'),
      new THREE.Color('#B8A9FF'),
      new THREE.Color('#FFD700'),
      new THREE.Color('#00FF87'),
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 55
      pos[i * 3 + 1] = (Math.random() - 0.5) * 38
      pos[i * 3 + 2] = (Math.random() - 0.5) * 32 - 10

      const color = palette[Math.floor(Math.random() * palette.length)]
      const b = 0.75 + Math.random() * 0.25
      col[i * 3]     = Math.min(color.r * b, 1)
      col[i * 3 + 1] = Math.min(color.g * b, 1)
      col[i * 3 + 2] = Math.min(color.b * b, 1)
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = mouse.x * 0.05 + t * 0.002
    mesh.current.rotation.x = -mouse.y * 0.03 + t * 0.001

    const mat = mesh.current.material as THREE.PointsMaterial
    mat.opacity = 0.55 + Math.sin(t * 3.0) * 0.22
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        map={texture || undefined}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── 1d. ETHEREAL COSMIC NEBULA GAS CLOUDS ─────────────────────────
function CosmicNebulaClouds({ count = 500, texture }: { count?: number; texture: THREE.Texture | null }) {
  const mesh = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const nebulaColors = [
      new THREE.Color('#00E5FF'),
      new THREE.Color('#7C3AED'),
      new THREE.Color('#FF2D9C'),
      new THREE.Color('#4B0082'),
      new THREE.Color('#00FF87'),
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 60
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = -15 - Math.random() * 35

      const c = nebulaColors[Math.floor(Math.random() * nebulaColors.length)]
      const alpha = 0.12 + Math.random() * 0.18
      col[i * 3]     = c.r * alpha
      col[i * 3 + 1] = c.g * alpha
      col[i * 3 + 2] = c.b * alpha
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = t * 0.0004
    mesh.current.rotation.z = Math.sin(t * 0.0002) * 0.05
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={2.8}
        map={texture || undefined}
        vertexColors
        transparent
        opacity={0.32}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── 1e. FORWARD-WARP ZOOM STREAKS ─────────────────────────────────
function WarpStarfield({ count = 1200, texture }: { count?: number; texture: THREE.Texture | null }) {
  const mesh = useRef<THREE.Points>(null)
  const { mouse } = useThree()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#D0E8FF'),
      new THREE.Color('#B8D4FF'),
      new THREE.Color('#B8A9FF'),
      new THREE.Color('#00E5FF'),
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10

      const color = palette[Math.floor(Math.random() * palette.length)]
      const brightness = 0.40 + Math.random() * 0.60
      col[i * 3]     = Math.min(color.r * brightness, 1)
      col[i * 3 + 1] = Math.min(color.g * brightness, 1)
      col[i * 3 + 2] = Math.min(color.b * brightness, 1)
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.position.z = (t * 2.2) % 25 - 12.5
    mesh.current.rotation.y = mouse.x * 0.08 + t * 0.003
    mesh.current.rotation.x = -mouse.y * 0.08
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        map={texture || undefined}
        vertexColors
        transparent
        opacity={0.70}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── 1f. POINT-SIZED GLOWING STARS (Vibrant Neon Celestial Dots) ──
function GlowingPointStars({ count = 3600, texture }: { count?: number; texture: THREE.Texture | null }) {
  const mesh = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    // Saturated neon glowing point palette (as shown in screenshot)
    const palette = [
      new THREE.Color('#00E5FF'), // Bright Cyan
      new THREE.Color('#00E5FF'), // Bright Cyan (heavy weight)
      new THREE.Color('#7C3AED'), // Electric Violet
      new THREE.Color('#FF2D9C'), // Hot Magenta
      new THREE.Color('#00FF87'), // Neon Emerald
      new THREE.Color('#FFFFFF'), // Pure Diamond White
      new THREE.Color('#B8A9FF'), // Soft Lavender
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 58
      pos[i * 3 + 1] = (Math.random() - 0.5) * 44
      pos[i * 3 + 2] = (Math.random() - 0.5) * 36 - 6

      const color = palette[Math.floor(Math.random() * palette.length)]
      const brightness = 0.65 + Math.random() * 0.35
      col[i * 3]     = Math.min(color.r * brightness, 1)
      col[i * 3 + 1] = Math.min(color.g * brightness, 1)
      col[i * 3 + 2] = Math.min(color.b * brightness, 1)
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = mouse.x * 0.05 + t * 0.0018
    mesh.current.rotation.x = -mouse.y * 0.03 + t * 0.0008
    mesh.current.position.z = (t * 0.9) % 20 - 10

    const mat = mesh.current.material as THREE.PointsMaterial
    mat.opacity = 0.75 + Math.sin(t * 2.5) * 0.15
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={texture || undefined}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── 1g. DYNAMIC CONSTELLATION NETWORK LINES & NODES ──────────────
function ConstellationNetwork({ count = 45 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const { mouse } = useThree()

  const [nodes, positions, colors, linePositions, lineColors] = useMemo(() => {
    const nodes = []
    const palette = [
      new THREE.Color('#00E5FF'),
      new THREE.Color('#7C3AED'),
      new THREE.Color('#FF2D9C'),
      new THREE.Color('#00FF87'),
      new THREE.Color('#FFFFFF'),
    ]

    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 38
      const y = (Math.random() - 0.5) * 26
      const z = (Math.random() - 0.5) * 16 - 2
      const vx = (Math.random() - 0.5) * 0.008
      const vy = (Math.random() - 0.5) * 0.008
      const color = palette[i % palette.length]

      nodes.push({ x, y, z, vx, vy, color, origX: x, origY: y })

      pos[i * 3]     = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      col[i * 3]     = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }

    const maxLines = count * 6
    const linePos = new Float32Array(maxLines * 6)
    const lineCol = new Float32Array(maxLines * 6)

    return [nodes, pos, col, linePos, lineCol]
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current || !linesRef.current) return
    const t = clock.getElapsedTime()

    const pAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const pArr = pAttr.array as Float32Array

    const lAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
    const lColAttr = linesRef.current.geometry.attributes.color as THREE.BufferAttribute
    const lArr = lAttr.array as Float32Array
    const lcArr = lColAttr.array as Float32Array

    let lineIdx = 0
    const connectDist = 5.2
    const mouseX = mouse.x * 2.5
    const mouseY = mouse.y * 2.5

    for (let i = 0; i < count; i++) {
      const n = nodes[i]
      n.x += n.vx
      n.y += n.vy

      if (Math.abs(n.x - n.origX) > 4) n.vx *= -1
      if (Math.abs(n.y - n.origY) > 3) n.vy *= -1

      const curX = n.x + Math.sin(t * 0.5 + i) * 0.3 + mouseX * 0.2
      const curY = n.y + Math.cos(t * 0.4 + i) * 0.3 + mouseY * 0.2
      const curZ = n.z

      pArr[i * 3]     = curX
      pArr[i * 3 + 1] = curY
      pArr[i * 3 + 2] = curZ

      // High performance neighbor-window loop (O(N) instead of O(N^2))
      const maxJ = Math.min(count, i + 5)
      for (let j = i + 1; j < maxJ; j++) {
        const n2 = nodes[j]
        const dx = curX - (n2.x + Math.sin(t * 0.5 + j) * 0.3 + mouseX * 0.2)
        const dy = curY - (n2.y + Math.cos(t * 0.4 + j) * 0.3 + mouseY * 0.2)
        const dz = curZ - n2.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < connectDist && lineIdx < lArr.length - 6) {
          const alpha = (1 - dist / connectDist) * 0.38

          lArr[lineIdx]     = curX
          lArr[lineIdx + 1] = curY
          lArr[lineIdx + 2] = curZ
          lArr[lineIdx + 3] = n2.x + Math.sin(t * 0.5 + j) * 0.3 + mouseX * 0.2
          lArr[lineIdx + 4] = n2.y + Math.cos(t * 0.4 + j) * 0.3 + mouseY * 0.2
          lArr[lineIdx + 5] = n2.z

          lcArr[lineIdx]     = n.color.r * alpha
          lcArr[lineIdx + 1] = n.color.g * alpha
          lcArr[lineIdx + 2] = n.color.b * alpha
          lcArr[lineIdx + 3] = n2.color.r * alpha
          lcArr[lineIdx + 4] = n2.color.g * alpha
          lcArr[lineIdx + 5] = n2.color.b * alpha

          lineIdx += 6
        }
      }
    }

    for (let k = lineIdx; k < lArr.length; k++) {
      lArr[k] = 0
      lcArr[k] = 0
    }

    pAttr.needsUpdate = true
    lAttr.needsUpdate = true
    lColAttr.needsUpdate = true
  })

  return (
    <group>
      {/* Glowing Star Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Constellation Network Geometry Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

// ── 2. LOGARITHMIC SPIRAL GALAXY ────────────────────────────────
function SpiralGalaxy({ starCount = 1400 }: { starCount?: number }) {
  const galaxyRef = useRef<THREE.Points>(null)
  const { mouse } = useThree()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(starCount * 3)
    const col = new Float32Array(starCount * 3)

    const arms = 4
    const radius = 16
    const spin = 1.3
    const randomness = 0.5
    const power = 3.5

    const insideColor = new THREE.Color('#00E5FF')
    const midColor = new THREE.Color('#7C3AED')
    const outsideColor = new THREE.Color('#FF2D9C')

    for (let i = 0; i < starCount; i++) {
      const r = Math.random() * radius
      const spinAngle = r * spin
      const armAngle = ((i % arms) * (Math.PI * 2)) / arms

      const randomX = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r
      const randomY = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r
      const randomZ = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r

      pos[i * 3]     = Math.cos(armAngle + spinAngle) * r + randomX + 4
      pos[i * 3 + 1] = randomY - 2
      pos[i * 3 + 2] = Math.sin(armAngle + spinAngle) * r + randomZ - 22

      const mixedColor = insideColor.clone()
      if (r < radius * 0.4) {
        mixedColor.lerp(midColor, r / (radius * 0.4))
      } else {
        mixedColor.lerp(outsideColor, (r - radius * 0.4) / (radius * 0.6))
      }

      const alpha = 0.35 + Math.random() * 0.35
      col[i * 3]     = mixedColor.r * alpha
      col[i * 3 + 1] = mixedColor.g * alpha
      col[i * 3 + 2] = mixedColor.b * alpha
    }

    return [pos, col]
  }, [starCount])

  useFrame(({ clock }) => {
    if (!galaxyRef.current) return
    const t = clock.getElapsedTime()

    galaxyRef.current.rotation.y = t * 0.02
    galaxyRef.current.rotation.z = -0.35 + Math.sin(t * 0.01) * 0.04
    galaxyRef.current.rotation.x = 0.5 + mouse.y * 0.08
    galaxyRef.current.position.x = 3 + mouse.x * 0.4
  })

  return (
    <points ref={galaxyRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.046}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── 3. DYNAMIC COSMIC PLANET COMPONENT (Traverses Whole Viewport & Wraps) ──
type TrajectoryType =
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'diagonal-down-right'
  | 'diagonal-down-left'
  | 'deep-flyby'

interface DynamicPlanetProps {
  name: string
  radius: number
  color: string
  accentColor: string
  hasRings?: boolean
  hasMoon?: boolean
  hasGrid?: boolean
  hasCorona?: boolean
  hasTorusRing?: boolean
  speed: number
  trajectory: TrajectoryType
  baseY?: number
  baseX?: number
  baseZ?: number
  yAmplitude?: number
  timeOffset?: number
  rotSpeed?: number
}

function DynamicCosmicPlanet({
  radius,
  color,
  accentColor,
  hasRings = false,
  hasMoon = false,
  hasGrid = false,
  hasCorona = false,
  hasTorusRing = false,
  speed,
  trajectory,
  baseY = 0,
  baseX = 0,
  baseZ = -10,
  yAmplitude = 2.0,
  timeOffset = 0,
  rotSpeed = 0.12,
}: DynamicPlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const gridRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Points>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const moonRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const { mouse } = useThree()

  // Ring particles for ringed planet
  const [ringPositions, ringColors] = useMemo(() => {
    if (!hasRings) return [new Float32Array(0), new Float32Array(0)]
    const count = 600
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const c1 = new THREE.Color(accentColor)
    const c2 = new THREE.Color(color)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = radius * 1.5 + Math.random() * radius * 1.5
      const tilt = (Math.random() - 0.5) * 0.04

      pos[i * 3]     = Math.cos(angle) * distance
      pos[i * 3 + 1] = tilt
      pos[i * 3 + 2] = Math.sin(angle) * distance

      const ratio = (distance - radius * 1.5) / (radius * 1.5)
      const baseCol = c1.clone().lerp(c2, ratio)
      const alpha = 0.35 + Math.random() * 0.45

      col[i * 3]     = baseCol.r * alpha
      col[i * 3 + 1] = baseCol.g * alpha
      col[i * 3 + 2] = baseCol.b * alpha
    }
    return [pos, col]
  }, [hasRings, radius, accentColor, color])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Self-rotations
    if (sphereRef.current) sphereRef.current.rotation.y = t * rotSpeed
    if (gridRef.current) {
      gridRef.current.rotation.y = -t * (rotSpeed * 1.3)
      gridRef.current.rotation.x = t * 0.05
    }
    if (ringRef.current) ringRef.current.rotation.y = -t * 0.1
    if (torusRef.current) {
      torusRef.current.rotation.z = t * 0.25
      torusRef.current.rotation.x = Math.sin(t * 0.3) * 0.3
    }
    if (moonRef.current) {
      const moonDist = radius * 2.8
      moonRef.current.position.x = Math.cos(t * 0.9) * moonDist
      moonRef.current.position.z = Math.sin(t * 0.9) * moonDist
      moonRef.current.position.y = Math.sin(t * 0.7) * 0.3
    }

    if (groupRef.current) {
      // Normalized trajectory progress (0 to 1 loop)
      const progress = ((t * speed + timeOffset) % 1 + 1) % 1

      let x = 0
      let y = 0
      let z = baseZ

      const SPAN_X = 52 // from -26 to +26
      const SPAN_Y = 36 // from -18 to +18

      switch (trajectory) {
        case 'left-to-right': {
          x = -26 + progress * SPAN_X
          y = baseY + Math.sin(x * 0.15) * yAmplitude
          z = baseZ + Math.cos(x * 0.1) * 2.0
          break
        }
        case 'right-to-left': {
          x = 26 - progress * SPAN_X
          y = baseY + Math.cos(x * 0.15) * yAmplitude
          z = baseZ + Math.sin(x * 0.1) * 2.0
          break
        }
        case 'top-to-bottom': {
          y = 18 - progress * SPAN_Y
          x = baseX + Math.sin(y * 0.2) * 4.0
          z = baseZ + Math.cos(y * 0.15) * 1.5
          break
        }
        case 'bottom-to-top': {
          y = -18 + progress * SPAN_Y
          x = baseX + Math.cos(y * 0.2) * 4.0
          z = baseZ + Math.sin(y * 0.15) * 1.5
          break
        }
        case 'diagonal-down-right': {
          x = -26 + progress * SPAN_X
          y = 18 - progress * SPAN_Y + Math.sin(progress * Math.PI * 2) * yAmplitude
          z = baseZ
          break
        }
        case 'diagonal-down-left': {
          x = 26 - progress * SPAN_X
          y = 18 - progress * SPAN_Y + Math.cos(progress * Math.PI * 2) * yAmplitude
          z = baseZ
          break
        }
        case 'deep-flyby': {
          x = -22 + progress * 44
          y = baseY + (progress - 0.5) * 8.0
          // Flies from deep background forward towards near space, then recedes
          z = baseZ + Math.sin(progress * Math.PI) * 12.0
          break
        }
      }

      // Parallax interaction with mouse
      groupRef.current.position.set(x + mouse.x * 0.5, y + mouse.y * 0.4, z)

      // Smooth edge fade in / out
      if (matRef.current) {
        let edgeAlpha = 1
        if (progress < 0.08) edgeAlpha = progress / 0.08
        else if (progress > 0.92) edgeAlpha = (1 - progress) / 0.08
        matRef.current.opacity = 0.75 * Math.max(0, Math.min(1, edgeAlpha))
      }
    }
  })

  return (
    <group ref={groupRef} rotation={[0.3, 0.2, 0.2]}>
      {/* Planet Sphere Core */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[radius, 22, 22]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.38}
          roughness={0.4}
          metalness={0.65}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Soft Ethereal Atmospheric Glow Haze (Native WebGL — 0ms CSS blur penalty) */}
      <mesh>
        <sphereGeometry args={[radius * 1.22, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.45, 12, 12]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Optional Cyber Latitude Grid */}
      {hasGrid && (
        <mesh ref={gridRef}>
          <sphereGeometry args={[radius * 1.05, 14, 14]} />
          <meshBasicMaterial
            color={accentColor}
            wireframe
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Optional Solar Corona Flare */}
      {hasCorona && (
        <mesh>
          <sphereGeometry args={[radius * 1.18, 14, 14]} />
          <meshBasicMaterial
            color={accentColor}
            wireframe
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Optional Particle Rings */}
      {hasRings && (
        <points ref={ringRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ringPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[ringColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            vertexColors
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Optional Holographic Energy Torus */}
      {hasTorusRing && (
        <mesh ref={torusRef}>
          <torusGeometry args={[radius * 1.5, 0.028, 8, 32]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Optional Orbiting Mini Moon */}
      {hasMoon && (
        <mesh ref={moonRef}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  )
}

// ── 4. FLEET OF 7 DYNAMIC DRIFTING & TRAVELING PLANETS ──────────
function PlanetaryFleet() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const planetConfigs: DynamicPlanetProps[] = useMemo(() => [
    // 🪐 1. Cyan Ringed Cyber Giant — Sweeps across from Left to Right
    {
      name: 'Cyber-Saturn',
      radius: isMobile ? 0.38 : 0.50,
      color: '#00E5FF',
      accentColor: '#7C3AED',
      hasRings: true,
      hasMoon: true,
      speed: 0.012, // graceful continuous cruise
      trajectory: 'left-to-right',
      baseY: 2.2,
      baseZ: -9,
      yAmplitude: 2.5,
      timeOffset: 0.15,
      rotSpeed: 0.15,
    },
    // ☀️ 2. Solar Magma Core Planet — Glides diagonally from Top-Right down to Left
    {
      name: 'Solar-Magma',
      radius: isMobile ? 0.34 : 0.46,
      color: '#FF6B2B',
      accentColor: '#FFE500',
      hasCorona: true,
      speed: 0.009,
      trajectory: 'diagonal-down-left',
      baseY: 1.0,
      baseZ: -12,
      yAmplitude: 1.8,
      timeOffset: 0.45,
      rotSpeed: 0.10,
    },
    // 💚 3. Quantum Emerald Planet with Energy Ring — Sweeps from Right to Left along lower space
    {
      name: 'Quantum-Emerald',
      radius: isMobile ? 0.30 : 0.42,
      color: '#00FF87',
      accentColor: '#00E5FF',
      hasTorusRing: true,
      speed: 0.014,
      trajectory: 'right-to-left',
      baseY: -3.2,
      baseZ: -11,
      yAmplitude: 2.0,
      timeOffset: 0.65,
      rotSpeed: 0.18,
    },
    // 💜 4. Violet Cyber-Sphere Planet — Ascends from Bottom to Top on the right quadrant
    {
      name: 'Violet-Sphere',
      radius: isMobile ? 0.32 : 0.44,
      color: '#7C3AED',
      accentColor: '#FF2D9C',
      hasGrid: true,
      speed: 0.011,
      trajectory: 'bottom-to-top',
      baseX: 7.0,
      baseZ: -13,
      timeOffset: 0.82,
      rotSpeed: 0.14,
    },
    // ❄️ 5. Cobalt Ice Super-Earth — Deep Space flyby approaching and receding
    {
      name: 'Cobalt-Ice',
      radius: isMobile ? 0.30 : 0.40,
      color: '#1AE2FF',
      accentColor: '#FFFFFF',
      hasGrid: true,
      speed: 0.010,
      trajectory: 'deep-flyby',
      baseY: 0.5,
      baseZ: -16,
      timeOffset: 0.30,
      rotSpeed: 0.12,
    },
    // 🔴 6. Crimson Ruby Exoplanet — Glides diagonally from Top-Left to Bottom-Right
    {
      name: 'Crimson-Ruby',
      radius: isMobile ? 0.28 : 0.38,
      color: '#FF2D9C',
      accentColor: '#FF6B2B',
      hasMoon: true,
      speed: 0.013,
      trajectory: 'diagonal-down-right',
      baseZ: -14,
      yAmplitude: 2.2,
      timeOffset: 0.05,
      rotSpeed: 0.16,
    },
    // 🔵 7. Lavender Aurora Wanderer — Descends from Top to Bottom on the left quadrant
    {
      name: 'Lavender-Aura',
      radius: isMobile ? 0.26 : 0.36,
      color: '#B8A9FF',
      accentColor: '#00E5FF',
      hasCorona: true,
      speed: 0.008,
      trajectory: 'top-to-bottom',
      baseX: -8.0,
      baseZ: -15,
      timeOffset: 0.55,
      rotSpeed: 0.09,
    },
  ], [isMobile])

  return (
    <group>
      {planetConfigs.map((cfg) => (
        <DynamicCosmicPlanet key={cfg.name} {...cfg} />
      ))}
    </group>
  )
}

// ── 5. SLEEK 3D ALIEN SPACESHIPS CRUISING ───────────────────────
function AlienSpaceships() {
  const ships = useMemo(() => [
    {
      id: 1,
      speed: 0.30,
      radiusX: 9.5,
      radiusY: 4.2,
      radiusZ: 6.5,
      baseY: 2.2,
      color: '#00E5FF',
      trailColor: '#7C3AED',
      phase: 0,
      scale: 0.20,
    },
    {
      id: 2,
      speed: 0.24,
      radiusX: 11.5,
      radiusY: 5.0,
      radiusZ: 8.0,
      baseY: -1.8,
      color: '#FF2D9C',
      trailColor: '#FF6B2B',
      phase: Math.PI * 0.75,
      scale: 0.17,
    },
    {
      id: 3,
      speed: 0.36,
      radiusX: 8.5,
      radiusY: 3.5,
      radiusZ: 7.0,
      baseY: 0.5,
      color: '#00FF87',
      trailColor: '#00E5FF',
      phase: Math.PI * 1.4,
      scale: 0.18,
    },
  ], [])

  const shipMeshes = useRef<(THREE.Group | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    ships.forEach((ship, i) => {
      const mesh = shipMeshes.current[i]
      if (!mesh) return

      const angle = t * ship.speed + ship.phase

      const x = Math.cos(angle) * ship.radiusX
      const y = Math.sin(angle * 1.4) * ship.radiusY + ship.baseY
      const z = Math.sin(angle) * ship.radiusZ - 6

      mesh.position.set(x, y, z)

      const nextX = Math.cos(angle + 0.05) * ship.radiusX
      const nextY = Math.sin((angle + 0.05) * 1.4) * ship.radiusY + ship.baseY
      const nextZ = Math.sin(angle + 0.05) * ship.radiusZ - 6

      mesh.lookAt(nextX, nextY, nextZ)
      mesh.rotation.z += Math.sin(t * 2) * 0.15
    })
  })

  return (
    <group>
      {ships.map((ship, i) => (
        <group
          key={ship.id}
          ref={(el) => { shipMeshes.current[i] = el }}
          scale={[ship.scale, ship.scale, ship.scale]}
        >
          {/* Saucer Hull */}
          <mesh>
            <cylinderGeometry args={[1.2, 0.4, 0.32, 16]} />
            <meshStandardMaterial
              color="#101322"
              emissive={ship.color}
              emissiveIntensity={0.35}
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Cockpit Dome */}
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.5, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial
              color={ship.color}
              emissive={ship.color}
              emissiveIntensity={0.7}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Ion Thruster */}
          <mesh position={[0, -0.2, 0]}>
            <coneGeometry args={[0.4, 0.28, 14]} />
            <meshBasicMaterial
              color={ship.trailColor}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Engine Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.04, 6, 20]} />
            <meshBasicMaterial
              color={ship.color}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          <pointLight color={ship.color} intensity={0.9} distance={5} />
        </group>
      ))}
    </group>
  )
}

// ── 6. DYNAMIC SHOOTING METEORS & FIREBALLS ─────────────────────
function Meteors({ count = 5 }: { count?: number }) {
  const meteorsRef = useRef<THREE.LineSegments>(null)

  const [meteorData] = useState(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 36,
      y: 10 + Math.random() * 15,
      z: -4 - Math.random() * 14,
      speedX: -(0.35 + Math.random() * 0.45),
      speedY: -(0.3 + Math.random() * 0.4),
      length: 2.2 + Math.random() * 2.8,
      delay: Math.random() * 5,
      active: false,
      timer: Math.random() * 4,
    }))
  })

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 6)
    const col = new Float32Array(count * 6)
    const headColor = new THREE.Color('#00E5FF')
    const tailColor = new THREE.Color('#7C3AED')

    for (let i = 0; i < count; i++) {
      pos[i * 6]     = 0
      pos[i * 6 + 1] = 0
      pos[i * 6 + 2] = 0
      pos[i * 6 + 3] = 0
      pos[i * 6 + 4] = 0
      pos[i * 6 + 5] = 0

      col[i * 6]     = headColor.r
      col[i * 6 + 1] = headColor.g
      col[i * 6 + 2] = headColor.b
      col[i * 6 + 3] = tailColor.r * 0.08
      col[i * 6 + 4] = tailColor.g * 0.08
      col[i * 6 + 5] = tailColor.b * 0.08
    }
    return [pos, col]
  }, [count])

  useFrame((_, delta) => {
    if (!meteorsRef.current) return
    const posAttr = meteorsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    meteorData.forEach((m, i) => {
      m.timer += delta
      if (!m.active && m.timer >= m.delay) {
        m.active = true
        m.x = 12 + Math.random() * 16
        m.y = 8 + Math.random() * 12
        m.z = -3 - Math.random() * 10
      }

      if (m.active) {
        m.x += m.speedX
        m.y += m.speedY

        posArray[i * 6]     = m.x
        posArray[i * 6 + 1] = m.y
        posArray[i * 6 + 2] = m.z
        posArray[i * 6 + 3] = m.x - m.speedX * m.length * 2.2
        posArray[i * 6 + 4] = m.y - m.speedY * m.length * 2.2
        posArray[i * 6 + 5] = m.z

        if (m.y < -14 || m.x < -22) {
          m.active = false
          m.timer = 0
          m.delay = 2.5 + Math.random() * 7
          posArray[i * 6]     = 0
          posArray[i * 6 + 1] = 0
          posArray[i * 6 + 2] = 0
          posArray[i * 6 + 3] = 0
          posArray[i * 6 + 4] = 0
          posArray[i * 6 + 5] = 0
        }
      }
    })

    posAttr.needsUpdate = true
  })

  return (
    <lineSegments ref={meteorsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// ── 7. ASTEROID BELT & SPACE DEBRIS ─────────────────────────────
function AsteroidBelt({ count = 35 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const asteroids = useMemo(() => {
    return Array.from({ length: count }, () => {
      const radius = 10 + Math.random() * 16
      const angle = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 7
      const scale = 0.05 + Math.random() * 0.12
      const rotSpeed = (Math.random() - 0.5) * 0.02
      const orbitSpeed = 0.02 + Math.random() * 0.03

      return { radius, angle, y, scale, rotSpeed, orbitSpeed }
    })
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    asteroids.forEach((ast, i) => {
      const currentAngle = ast.angle + t * ast.orbitSpeed
      dummy.position.set(
        Math.cos(currentAngle) * ast.radius,
        ast.y + Math.sin(t * 0.3 + i) * 0.2,
        Math.sin(currentAngle) * ast.radius - 9
      )
      dummy.rotation.set(t * ast.rotSpeed, t * ast.rotSpeed * 1.3, t * ast.rotSpeed * 0.7)
      dummy.scale.set(ast.scale, ast.scale, ast.scale)
      dummy.updateMatrix()
      meshRef.current?.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#00E5FF"
        emissive="#7C3AED"
        emissiveIntensity={0.25}
        roughness={0.7}
        metalness={0.3}
        wireframe={true}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

// ── 8. MULTI-COLOR COSMIC LIGHTING ─────────────────────────────
function CosmicLighting() {
  return (
    <group>
      <pointLight position={[6, 4, -2]} color="#00E5FF" intensity={1.6} distance={24} decay={2} />
      <pointLight position={[-6, -3, -4]} color="#7C3AED" intensity={1.4} distance={22} decay={2} />
      <pointLight position={[-5, 4, -5]} color="#FF6B2B" intensity={1.3} distance={20} decay={2} />
      <pointLight position={[0, -5, -5]} color="#00FF87" intensity={1.0} distance={18} decay={2} />
      <ambientLight intensity={0.38} />
    </group>
  )
}

// ── 9a. COSMIC FLIGHT RIG — MOBILE / HIGH-END (full mouse parallax) ──
function CosmicFlightRigFull() {
  const { camera, mouse } = useThree()
  const scrollRef = useRef(0)
  const cachedTarget = useRef({ x: 0, y: 0, z: 9, rx: 0, ry: 0, rz: 0 })
  const frameRef = useRef(0)

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(({ clock }) => {
    frameRef.current++
    if (frameRef.current % 2 === 0) {
      const t = clock.getElapsedTime()
      const floatX = Math.sin(t * 0.28) * 0.4 + Math.cos(t * 0.18) * 0.2
      const floatY = Math.cos(t * 0.22) * 0.3 + Math.sin(t * 0.15) * 0.18
      const floatZ = Math.sin(t * 0.12) * 0.28
      cachedTarget.current.x = mouse.x * 2.0 + floatX
      cachedTarget.current.y = mouse.y * 1.4 + floatY - (scrollRef.current * 0.001)
      cachedTarget.current.z = 9 + floatZ
      cachedTarget.current.rx = mouse.y * 0.06 + Math.sin(t * 0.18) * 0.012
      cachedTarget.current.ry = -mouse.x * 0.08 + Math.cos(t * 0.2) * 0.012
      cachedTarget.current.rz = -mouse.x * 0.03 + Math.sin(t * 0.25) * 0.008
    }
    const c = cachedTarget.current
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, c.x, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, c.y, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, c.z, 0.05)
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, c.rx, 0.05)
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, c.ry, 0.05)
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, c.rz, 0.05)
  })
  return null
}

// ── 9b. COSMIC FLIGHT RIG — DESKTOP (float-only, NO mouse tracking, every 3rd frame) ──
// Mouse tracking on a 1920×1080 canvas costs significant GPU time every frame.
// Float-only animation is indistinguishable visually and 3× lighter.
function CosmicFlightRigLight() {
  const { camera } = useThree()
  const frameRef = useRef(0)
  const cachedTarget = useRef({ x: 0, y: 0, z: 9 })

  useFrame(({ clock }) => {
    frameRef.current++
    // Recompute only every 3rd frame
    if (frameRef.current % 3 === 0) {
      const t = clock.getElapsedTime()
      cachedTarget.current.x = Math.sin(t * 0.18) * 0.35 + Math.cos(t * 0.11) * 0.15
      cachedTarget.current.y = Math.cos(t * 0.14) * 0.25 + Math.sin(t * 0.09) * 0.12
      cachedTarget.current.z = 9 + Math.sin(t * 0.08) * 0.2
    }
    const c = cachedTarget.current
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, c.x, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, c.y, 0.03)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, c.z, 0.03)
  })
  return null
}

// ── COSMIC SCENE — Tier-aware rendering ──
function CosmicScene({ tier }: { tier: 'mobile' | 'desktop' | 'high' }) {
  const textures = useCosmicTextures()
  const isMobile = tier === 'mobile'
  const isHigh = tier === 'high'

  return (
    <>
      {/* Flight rig: Light float on mobile/desktop, full parallax on high-end */}
      {isHigh ? <CosmicFlightRigFull /> : <CosmicFlightRigLight />}
      <CosmicLighting />
      {/* 🌌 Layer 1: Nebula — enable on high-end only */}
      {isHigh && <CosmicNebulaClouds count={280} texture={textures.nebula} />}
      {/* ✨ Layer 2: Deep-Space Starfield */}
      <DeepFieldStars count={isMobile ? 3500 : isHigh ? 10000 : 4500} texture={textures.star} />
      {/* ✨ Layer 3: Glowing Point Stars */}
      <GlowingPointStars count={isMobile ? 400 : isHigh ? 1500 : 700} texture={textures.glowingPoint} />
      {/* 🌐 Layer 4: Constellation Network */}
      <ConstellationNetwork count={isMobile ? 12 : isHigh ? 28 : 16} />
      {/* ✨ Layer 5: Twinkling Stars */}
      <TwinklingStars count={isMobile ? 400 : isHigh ? 1500 : 700} texture={textures.star} />
      {/* 🌟 Layer 6: Starburst Focal Stars */}
      <StarburstFocalStars count={isMobile ? 18 : isHigh ? 60 : 25} texture={textures.starburst} />
      {/* 🌀 Layer 8: Spiral Galaxy */}
      <SpiralGalaxy starCount={isMobile ? 250 : isHigh ? 600 : 350} />
      {/* 🪐 Layer 9: Planetary Fleet */}
      <PlanetaryFleet />
      {/* 🛸 Layer 10: Alien Spaceships */}
      <AlienSpaceships />
      {/* ☄️ Layer 11: Meteors */}
      <Meteors count={isMobile ? 2 : isHigh ? 4 : 2} />
      {/* 🪨 Layer 12: Asteroid Belt */}
      <AsteroidBelt count={isMobile ? 8 : isHigh ? 16 : 10} />
    </>
  )
}

// ── MAIN COSMIC 3D UNIVERSE CANVAS ──────────────────
// Hardware tier detection
function detectTier(): 'mobile' | 'desktop' | 'high' {
  if (typeof window === 'undefined') return 'desktop'
  if (window.innerWidth < 1024) return 'mobile'
  const cores = (navigator as any).hardwareConcurrency ?? 4
  const mem = (navigator as any).deviceMemory ?? 4
  // High-end: 8+ cores AND 8+ GB RAM
  if (cores >= 8 && mem >= 8) return 'high'
  return 'desktop'
}

export default function ParticleField() {
  const [isTabVisible, setIsTabVisible] = useState(true)
  const tier = typeof window !== 'undefined' ? detectTier() : 'desktop'
  const isMobile = tier === 'mobile'

  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibility, { passive: true })
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const dpr: number = isMobile ? 1 : tier === 'high' ? 1 : 0.75

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 65 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
        preserveDrawingBuffer: false,
      }}
      dpr={dpr}
      frameloop={isTabVisible ? 'always' : 'never'}
      style={{
        background: 'transparent',
        pointerEvents: 'none',
        opacity: 0.92,
      }}
    >
      <CosmicScene tier={tier} />
    </Canvas>
  )
}
