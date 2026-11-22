'use client'

import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getPlanetTexture } from '@/components/space/textureLoader'

// ═══════════════════════════════════════════════════════════════════════════
// 1. NEUTRAL WHITE PROCEDURAL TEXTURES (Pure Luminance Falloff)
// ═══════════════════════════════════════════════════════════════════════════
function useCosmicTextures() {
  return useMemo(() => {
    if (typeof document === 'undefined') {
      return { star: null, glowingPoint: null, starburst: null, nebula: null }
    }

    // Soft round starlight disc
    const starCanvas = document.createElement('canvas')
    starCanvas.width = 64
    starCanvas.height = 64
    const sCtx = starCanvas.getContext('2d')
    if (sCtx) {
      const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)')
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)')
      grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.04)')
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      sCtx.fillStyle = grad
      sCtx.fillRect(0, 0, 64, 64)
    }
    const starTex = new THREE.CanvasTexture(starCanvas)

    // Intense point star with radiant halo
    const gpCanvas = document.createElement('canvas')
    gpCanvas.width = 64
    gpCanvas.height = 64
    const gpCtx = gpCanvas.getContext('2d')
    if (gpCtx) {
      const grad = gpCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
      grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)')
      grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.65)')
      grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.18)')
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      gpCtx.fillStyle = grad
      gpCtx.fillRect(0, 0, 64, 64)
    }
    const gpTex = new THREE.CanvasTexture(gpCanvas)

    // Anamorphic 4-point starburst with diffraction spikes
    const sbCanvas = document.createElement('canvas')
    sbCanvas.width = 128
    sbCanvas.height = 128
    const sbCtx = sbCanvas.getContext('2d')
    if (sbCtx) {
      const grad = sbCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
      grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.85)')
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.18)')
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      sbCtx.fillStyle = grad
      sbCtx.fillRect(0, 0, 128, 128)

      sbCtx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
      sbCtx.lineWidth = 1.2
      sbCtx.beginPath()
      sbCtx.moveTo(4, 64); sbCtx.lineTo(124, 64)
      sbCtx.moveTo(64, 4); sbCtx.lineTo(64, 124)
      sbCtx.stroke()
    }
    const sbTex = new THREE.CanvasTexture(sbCanvas)

    // Subtle space dust clouds
    const nebCanvas = document.createElement('canvas')
    nebCanvas.width = 128
    nebCanvas.height = 128
    const nCtx = nebCanvas.getContext('2d')
    if (nCtx) {
      const grad = nCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)')
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.22)')
      grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)')
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      nCtx.fillStyle = grad
      nCtx.fillRect(0, 0, 128, 128)
    }
    const nebTex = new THREE.CanvasTexture(nebCanvas)

    return { star: starTex, glowingPoint: gpTex, starburst: sbTex, nebula: nebTex }
  }, [])
}

interface StarLayerProps {
  count?: number;
  texture?: THREE.Texture | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// 2a. VIBRANT FLOATING COSMIC STARDUST (Dense, Multi-Colored Star Dust Flow)
// ═══════════════════════════════════════════════════════════════════════════
function CosmicStardust({ count = 8500, texture }: StarLayerProps) {
  const mesh = useRef<any>(null)

  const [positions, colors, floatData] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const data = []

    // Highly vibrant celestial stardust spectrum matching the original UI:
    // Electric Cyan, Neon Magenta, Solar Gold, Amethyst Violet, Aurora Green, Diamond White, Ice Blue
    const palette = [
      { c: new THREE.Color('#00E5FF'), w: 32 }, // Electric Cyan
      { c: new THREE.Color('#FF2D9C'), w: 20 }, // Neon Rose / Magenta
      { c: new THREE.Color('#FFD700'), w: 18 }, // Solar Gold
      { c: new THREE.Color('#B388FF'), w: 14 }, // Amethyst Violet
      { c: new THREE.Color('#00E676'), w: 8 },  // Aurora Emerald
      { c: new THREE.Color('#FFFFFF'), w: 16 }, // Pure Radiant White
      { c: new THREE.Color('#80D8FF'), w: 10 }, // Celestial Ice Blue
    ]
    const totalWeight = palette.reduce((s, p) => s + p.w, 0)
    const pickColor = () => {
      let r = Math.random() * totalWeight
      for (const p of palette) {
        r -= p.w
        if (r <= 0) return p.c
      }
      return palette[0].c
    }

    for (let i = 0; i < count; i++) {
      // Wide volume filling the whole viewable cosmic space
      pos[i * 3]     = (Math.random() - 0.5) * 95
      pos[i * 3 + 1] = (Math.random() - 0.5) * 75
      // Z depth brought forward so dust floats in front of camera down into midground
      pos[i * 3 + 2] = -38 + Math.random() * 45

      const color = pickColor()
      // Varied brightness for dynamic twinkling shimmer
      const b = 0.55 + Math.random() * 0.45
      col[i * 3]     = Math.min(color.r * b, 1)
      col[i * 3 + 1] = Math.min(color.g * b, 1)
      col[i * 3 + 2] = Math.min(color.b * b, 1)

      data.push({
        origX: pos[i * 3],
        origY: pos[i * 3 + 1],
        driftSpeedZ: 1.8 + Math.random() * 2.4,
        freqX: 0.4 + Math.random() * 0.8,
        freqY: 0.3 + Math.random() * 0.7,
        ampX: 0.35 + Math.random() * 0.65,
        ampY: 0.35 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return [pos, col, data]
  }, [count])

  useFrame(({ clock, mouse }, delta) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    const dt = Math.min(delta, 0.05)
    const posAttr = mesh.current.geometry.attributes.position
    const pos = posAttr.array

    // Continuous floating flow throughout the entire space
    for (let i = 0; i < count; i++) {
      const d = floatData[i]
      // Forward drift in Z
      pos[i * 3 + 2] += d.driftSpeedZ * dt
      // Wrap seamlessly from behind camera back to deep space
      if (pos[i * 3 + 2] > 7.5) {
        pos[i * 3 + 2] = -38
      }

      // Gentle organic sinusoidal wave in X & Y
      pos[i * 3]     = d.origX + Math.sin(t * d.freqX + d.phase) * d.ampX
      pos[i * 3 + 1] = d.origY + Math.cos(t * d.freqY + d.phase) * d.ampY
    }
    posAttr.needsUpdate = true

    // Parallax response to mouse
    mesh.current.rotation.y = mouse.x * 0.035 + t * 0.0006
    mesh.current.rotation.x = -mouse.y * 0.02 + t * 0.0003
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        map={texture || undefined}
        vertexColors
        color="#FFFFFF"
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 2b. MOVING DEEP-SPACE FIELD (Stars Drift in Z — Space Feels ALIVE & MOVING)
// ═══════════════════════════════════════════════════════════════════════════
function DeepFieldStars({ count = 5500, texture }: StarLayerProps) {
  const mesh = useRef<any>(null)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    // Astronomical stellar classification: O, B, A, F, G, K, M types
    const palette = [
      { c: new THREE.Color('#FFFFFF'), w: 32 }, // Diamond White (Class A)
      { c: new THREE.Color('#FFF8E7'), w: 22 }, // Solar Warm White (Class F)
      { c: new THREE.Color('#FFD54F'), w: 18 }, // Golden Sunlight (Class G)
      { c: new THREE.Color('#FFB74D'), w: 14 }, // Amber Giant (Class K)
      { c: new THREE.Color('#FF5252'), w: 8 },  // Red Supergiant (Class M)
      { c: new THREE.Color('#00E676'), w: 4 },  // Aurora Emerald ionized gas
      { c: new THREE.Color('#CE93D8'), w: 4 },  // Violet Pulsar dust
      { c: new THREE.Color('#FF80AB'), w: 2 },  // Cosmic Rose dust
    ]
    const totalWeight = palette.reduce((s, p) => s + p.w, 0)
    const pickColor = () => {
      let r = Math.random() * totalWeight
      for (const p of palette) {
        r -= p.w
        if (r <= 0) return p.c
      }
      return palette[0].c
    }

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 115
      pos[i * 3 + 1] = (Math.random() - 0.5) * 90
      pos[i * 3 + 2] = -55 + Math.random() * 60

      const color = pickColor()
      const b = 0.45 + Math.random() * 0.55
      col[i * 3] = Math.min(color.r * b, 1)
      col[i * 3 + 1] = Math.min(color.g * b, 1)
      col[i * 3 + 2] = Math.min(color.b * b, 1)
    }
    return [pos, col]
  }, [count])

  useFrame((_, delta) => {
    if (!mesh.current) return
    const posAttr = mesh.current.geometry.attributes.position
    const pos = posAttr.array
    const dt = Math.min(delta, 0.05)
    const driftSpeed = 1.2 // Dynamic forward flight drift through deep space

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 2] += driftSpeed * dt
      // Wrap smoothly to deep space when passing camera
      if (pos[i * 3 + 2] > 6) {
        pos[i * 3 + 2] = -55
      }
    }
    posAttr.needsUpdate = true
    mesh.current.rotation.y += dt * 0.0004
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.088}
        map={texture || undefined}
        vertexColors
        color="#FFFFFF"
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 2c. BRIGHTENING & DIMINISHING MULTI-COLORED TINY CELESTIAL OBJECTS (Sparkles)
// ═══════════════════════════════════════════════════════════════════════════
function BrighteningDiminishingSparkles({ count = 500, texture }: StarLayerProps) {
  const mesh = useRef<any>(null)

  const [positions, colors, sparkleData] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const data = []

    // Brilliant multi-colored jewel sparkles: Gold, Ruby, Emerald, Violet, Rose, Amber, Diamond
    const palette = [
      new THREE.Color('#FFD700'), // Solar Gold
      new THREE.Color('#FF5252'), // Ruby Crimson
      new THREE.Color('#00E676'), // Aurora Emerald
      new THREE.Color('#E040FB'), // Amethyst Violet
      new THREE.Color('#FF6D00'), // Fiery Amber
      new THREE.Color('#FF4081'), // Hot Rose
      new THREE.Color('#00E5FF'), // Aquamarine Cyan
      new THREE.Color('#FFFFFF'), // Pure Diamond
      new THREE.Color('#FFF59D'), // Soft Topaz
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 88
      pos[i * 3 + 1] = (Math.random() - 0.5) * 72
      pos[i * 3 + 2] = -4 - Math.random() * 42

      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b

      data.push({
        baseColor: c,
        pulseFreq: 1.2 + Math.random() * 3.5,
        phase: Math.random() * Math.PI * 2,
        baseBrightness: 0.3 + Math.random() * 0.7,
      })
    }
    return [pos, col, data]
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    const colAttr = mesh.current.geometry.attributes.color
    const col = colAttr.array

    // Dynamic sinusoidal brightening and diminishing for every tiny object
    for (let i = 0; i < count; i++) {
      const sp = sparkleData[i]
      const wave = Math.sin(t * sp.pulseFreq + sp.phase) * 0.5 + 0.5 // 0 to 1
      const brightness = 0.15 + wave * 0.85

      col[i * 3] = sp.baseColor.r * brightness
      col[i * 3 + 1] = sp.baseColor.g * brightness
      col[i * 3 + 2] = sp.baseColor.b * brightness
    }
    colAttr.needsUpdate = true
    mesh.current.rotation.y = t * 0.0008
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={texture || undefined}
        vertexColors
        color="#FFFFFF"
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 2d. VIBRANT MULTI-SPECTRUM GLOWING POINT STARS
// ═══════════════════════════════════════════════════════════════════════════
function GlowingPointStars({ count = 380, texture }: StarLayerProps) {
  const mesh = useRef<any>(null)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#FFD700'), // Solar Gold
      new THREE.Color('#FF5252'), // Crimson Red
      new THREE.Color('#00E676'), // Emerald Aurora
      new THREE.Color('#FF9800'), // Warm Amber
      new THREE.Color('#BA68C8'), // Amethyst Violet
      new THREE.Color('#FF2D9C'), // Hot Rose
      new THREE.Color('#FFFFFF'), // Pure Diamond
      new THREE.Color('#FFE082'), // Soft Topaz
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 82
      pos[i * 3 + 1] = (Math.random() - 0.5) * 68
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45 - 6
      const color = palette[Math.floor(Math.random() * palette.length)]
      const b = 0.78 + Math.random() * 0.22
      col[i * 3] = Math.min(color.r * b, 1)
      col[i * 3 + 1] = Math.min(color.g * b, 1)
      col[i * 3 + 2] = Math.min(color.b * b, 1)
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = mouse.x * 0.05 + t * 0.0014
    mesh.current.rotation.x = -mouse.y * 0.03 + t * 0.0007
    const mat = mesh.current.material
    mat.opacity = 0.85 + Math.sin(t * 2.2) * 0.15
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        map={texture || undefined}
        vertexColors
        color="#FFFFFF"
        transparent
        opacity={0.90}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 2e. STARBURST FOCAL STARS
// ═══════════════════════════════════════════════════════════════════════════
function StarburstFocalStars({ count = 35, texture }: StarLayerProps) {
  const mesh = useRef<any>(null)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#FFFFFF'), // Brilliant Diamond
      new THREE.Color('#FFD700'), // Solar Gold
      new THREE.Color('#FF5252'), // Crimson Supergiant
      new THREE.Color('#00E676'), // Emerald Flare
      new THREE.Color('#E040FB'), // Magenta Starburst
      new THREE.Color('#FF9100'), // Amber Starburst
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 72
      pos[i * 3 + 1] = (Math.random() - 0.5) * 58
      pos[i * 3 + 2] = (Math.random() - 0.5) * 36 - 10
      const color = palette[Math.floor(Math.random() * palette.length)]
      const b = 0.88 + Math.random() * 0.12
      col[i * 3] = Math.min(color.r * b, 1)
      col[i * 3 + 1] = Math.min(color.g * b, 1)
      col[i * 3 + 2] = Math.min(color.b * b, 1)
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = mouse.x * 0.045 + t * 0.0016
    mesh.current.rotation.x = -mouse.y * 0.025 + t * 0.0008
    const mat = mesh.current.material
    mat.opacity = 0.72 + Math.sin(t * 3.2) * 0.22
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.26}
        map={texture || undefined}
        vertexColors
        color="#FFFFFF"
        transparent
        opacity={0.80}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 2f. DYNAMIC CONSTELLATION NETWORK LINES & NODES
// ═══════════════════════════════════════════════════════════════════════════
function ConstellationNetwork({ count = 50 }: { count?: number }) {
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
      const x = (Math.random() - 0.5) * 44
      const y = (Math.random() - 0.5) * 32
      const z = (Math.random() - 0.5) * 18 - 2
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
    const connectDist = 5.5
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

      const maxJ = Math.min(count, i + 6)
      for (let j = i + 1; j < maxJ; j++) {
        const n2 = nodes[j]
        const dx = curX - (n2.x + Math.sin(t * 0.5 + j) * 0.3 + mouseX * 0.2)
        const dy = curY - (n2.y + Math.cos(t * 0.4 + j) * 0.3 + mouseY * 0.2)
        const dz = curZ - n2.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < connectDist && lineIdx < lArr.length - 6) {
          const alpha = (1 - dist / connectDist) * 0.35

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
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.50}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 2h. WARP STARFIELD (Stars Streaming Forward — Dynamic Cosmic Velocity)
// ═══════════════════════════════════════════════════════════════════════════
function WarpStarfield({ count = 1200, texture }: StarLayerProps) {
  const mesh = useRef<any>(null)
  const { mouse } = useThree()

  const [positions, colors, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = new Float32Array(count)

    const palette = [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#80D8FF'),
      new THREE.Color('#00E5FF'),
      new THREE.Color('#B388FF'),
      new THREE.Color('#FFD54F'),
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 65
      pos[i * 3 + 1] = (Math.random() - 0.5) * 48
      pos[i * 3 + 2] = -45 + Math.random() * 50

      const color = palette[Math.floor(Math.random() * palette.length)]
      const brightness = 0.65 + Math.random() * 0.35
      col[i * 3]     = color.r * brightness
      col[i * 3 + 1] = color.g * brightness
      col[i * 3 + 2] = color.b * brightness

      spd[i] = 2.2 + Math.random() * 2.8 // Rapid forward warp streaming
    }
    return [pos, col, spd]
  }, [count])

  useFrame((_, delta) => {
    if (!mesh.current) return
    const dt = Math.min(delta, 0.05)
    const posAttr = mesh.current.geometry.attributes.position
    const pos = posAttr.array

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 2] += speeds[i] * dt
      if (pos[i * 3 + 2] > 7.5) {
        pos[i * 3 + 2] = -45
        pos[i * 3] = (Math.random() - 0.5) * 65
        pos[i * 3 + 1] = (Math.random() - 0.5) * 48
      }
    }
    posAttr.needsUpdate = true
    mesh.current.rotation.y = mouse.x * 0.035
    mesh.current.rotation.x = -mouse.y * 0.025
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={texture || undefined}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 2g. HYPER-REALISTIC INTERACTIVE 3D MILKY WAY SPIRAL GALAXY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Procedurally generates a smooth circular feathered alpha mask over the
 * high-resolution NASA Milky Way spiral galaxy photograph so its outer boundary
 * seamlessly melts into the surrounding cosmic starfield with zero square edges.
 */
function useRealisticMilkyWayTexture() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/textures/space/milky_way_nasa.jpg'
    img.onload = () => {
      // Draw authentic NASA Milky Way spiral galaxy image
      ctx.drawImage(img, 0, 0, 1024, 1024)

      // Apply smooth radial vignette to feather outer edge to 100% transparency
      ctx.globalCompositeOperation = 'destination-in'
      const grad = ctx.createRadialGradient(512, 512, 160, 512, 512, 510)
      grad.addColorStop(0, 'rgba(0, 0, 0, 1.0)')
      grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.98)')
      grad.addColorStop(0.78, 'rgba(0, 0, 0, 0.70)')
      grad.addColorStop(0.90, 'rgba(0, 0, 0, 0.30)')
      grad.addColorStop(0.98, 'rgba(0, 0, 0, 0.05)')
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1024, 1024)

      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = true
      setTexture(tex)
    }
  }, [])

  return texture
}

function useGalacticCoreGlowTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      grad.addColorStop(0, 'rgba(255, 252, 235, 1.0)')
      grad.addColorStop(0.2, 'rgba(255, 215, 64, 0.85)')
      grad.addColorStop(0.48, 'rgba(255, 145, 0, 0.42)')
      grad.addColorStop(0.75, 'rgba(186, 104, 200, 0.16)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 256, 256)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function SpiralGalaxy({ starCount = 1200 }: { starCount?: number }) {
  const galaxyGroupRef = useRef<THREE.Group>(null)
  const discMeshRef = useRef<THREE.Mesh>(null)
  const coreGlowRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { mouse } = useThree()

  const milkyWayTexture = useRealisticMilkyWayTexture()
  const coreGlowTexture = useGalacticCoreGlowTexture()

  // 1,200 particle stars distributed along the 4 spiral arms with 3D volumetric thickness
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(starCount * 3)
    const col = new Float32Array(starCount * 3)
    const arms = 4
    const radius = 24
    const spin = 1.4
    const randomness = 0.5
    const power = 3.2

    const coreColor = new THREE.Color('#FFF8E1')
    const midColor = new THREE.Color('#FFD54F')
    const nebulaePink = new THREE.Color('#F48FB1')
    const outerCyan = new THREE.Color('#80DEEA')

    for (let i = 0; i < starCount; i++) {
      const r = Math.random() * radius
      const spinAngle = r * spin
      const armAngle = ((i % arms) * (Math.PI * 2)) / arms
      const randomX = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r
      const randomY = (Math.random() - 0.5) * (0.8 + (r / radius) * 2.2)
      const randomZ = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r

      pos[i * 3] = Math.cos(armAngle + spinAngle) * r + randomX
      pos[i * 3 + 1] = randomY
      pos[i * 3 + 2] = Math.sin(armAngle + spinAngle) * r + randomZ

      const mixedColor = coreColor.clone()
      if (r < radius * 0.28) {
        mixedColor.lerp(midColor, r / (radius * 0.28))
      } else if (r < radius * 0.65) {
        mixedColor.copy(midColor).lerp(nebulaePink, (r - radius * 0.28) / (radius * 0.37))
      } else {
        mixedColor.copy(nebulaePink).lerp(outerCyan, (r - radius * 0.65) / (radius * 0.35))
      }
      const alpha = 0.55 + Math.random() * 0.45
      col[i * 3] = mixedColor.r * alpha
      col[i * 3 + 1] = mixedColor.g * alpha
      col[i * 3 + 2] = mixedColor.b * alpha
    }
    return [pos, col]
  }, [starCount])

  // Traversal & periodic celestial cycle constants
  const CYCLE_PERIOD = 48 // Total interval between transits (seconds)
  const TRANSIT_DURATION = 8.8 // Swift transit duration across the sky (seconds)
  const INITIAL_DELAY = 3.5 // Initial delay before the first cosmic flyby (seconds)
  const START_X = -82 // Far offscreen left
  const END_X = 82 // Far offscreen right
  const BASE_Z = -36 // Deep-space background layer behind planets
  const BASE_REL_Y = 3.4 // Upper celestial corridor relative to camera

  const baseRot = useRef({ x: 1.08, y: -0.32, z: 0.45 })
  const spinAngleRef = useRef(0)
  const tempVec = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (!galaxyGroupRef.current) return
    const t = state.clock.getElapsedTime()
    const adjustedTime = t - INITIAL_DELAY

    // Determine periodic transit progress
    let progress = -1
    if (adjustedTime >= 0) {
      const cycleTime = adjustedTime % CYCLE_PERIOD
      if (cycleTime < TRANSIT_DURATION) {
        progress = cycleTime / TRANSIT_DURATION
      }
    }

    // ── Inactive Cooldown: Hide galaxy completely so foreground font UI is undisturbed ──
    if (progress < 0) {
      if (galaxyGroupRef.current.visible) {
        galaxyGroupRef.current.visible = false
      }
      return
    }

    // Active transit!
    if (!galaxyGroupRef.current.visible) {
      galaxyGroupRef.current.visible = true
    }

    // 1. Fast Left-to-Right Linear Traversal with Celestial Arc
    const currentX = START_X + progress * (END_X - START_X)
    const arcY = Math.sin(progress * Math.PI) * 1.2
    const floatX = Math.sin(t * 0.45) * 0.40
    const floatY = Math.cos(t * 0.35) * 0.45
    const floatZ = Math.sin(t * 0.25) * 0.35

    const targetX = currentX + floatX
    const targetY = state.camera.position.y + BASE_REL_Y + arcY + floatY
    const targetZ = BASE_Z + floatZ

    // 2. Dynamic Screen-Space Cursor Proximity Tracking
    tempVec.current.set(targetX, targetY, targetZ).project(state.camera)
    const cursorDist = Math.hypot(mouse.x - tempVec.current.x, mouse.y - tempVec.current.y)
    const proximity = Math.max(0, 1 - cursorDist / 0.65) // 0 (far) to 1 (cursor directly over galaxy)

    // 3. Dynamic Spiral Spin with Gravitational Acceleration
    const spinRate = 0.024 + proximity * 0.055
    spinAngleRef.current += spinRate * delta

    // 4. Smooth Alpha Bell-Curve (0 at offscreen spawn -> 1 at center -> 0 at offscreen exit)
    const fade = Math.pow(Math.sin(progress * Math.PI), 0.72)

    // 5. Magnetic 3D Cursor Tilting & Aerodynamic Banking
    const targetRotX = baseRot.current.x + mouse.y * 0.22 + proximity * 0.15
    const targetRotY = baseRot.current.y - mouse.x * 0.28 - proximity * 0.20
    const targetRotZ = baseRot.current.z + mouse.x * 0.12 - 0.06

    galaxyGroupRef.current.rotation.x = THREE.MathUtils.lerp(galaxyGroupRef.current.rotation.x, targetRotX, 0.08)
    galaxyGroupRef.current.rotation.y = THREE.MathUtils.lerp(galaxyGroupRef.current.rotation.y, targetRotY, 0.08)
    galaxyGroupRef.current.rotation.z = THREE.MathUtils.lerp(galaxyGroupRef.current.rotation.z, targetRotZ, 0.08)

    // 6. 3D Position Update (slightly pulls forward toward cursor on proximity)
    galaxyGroupRef.current.position.set(
      targetX,
      targetY,
      targetZ + proximity * 3.0
    )

    // 7. Modulate Disc & Core Opacities (Clean, luminous, non-blinding for foreground text)
    if (discMeshRef.current) {
      discMeshRef.current.rotation.z = spinAngleRef.current
      const mat = discMeshRef.current.material as THREE.MeshBasicMaterial
      if (mat) {
        mat.opacity = fade * (0.75 + proximity * 0.22)
      }
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = spinAngleRef.current * 0.85
      const mat = particlesRef.current.material as THREE.PointsMaterial
      if (mat) {
        mat.opacity = fade * (0.70 + proximity * 0.25)
      }
    }

    // 8. Supermassive Galactic Core Pulsing Glow
    if (coreGlowRef.current) {
      const corePulse = 1.0 + Math.sin(t * 2.2) * 0.08 + proximity * 0.35
      coreGlowRef.current.scale.set(corePulse, corePulse, corePulse)
      const mat = coreGlowRef.current.material as THREE.MeshBasicMaterial
      if (mat) {
        mat.opacity = fade * (0.85 + proximity * 0.15)
      }
    }
  })

  return (
    <group ref={galaxyGroupRef} visible={false}>
      {/* ── 1. High-Resolution NASA Milky Way Spiral Disc with Seamless Alpha Feathering ── */}
      {milkyWayTexture && (
        <mesh ref={discMeshRef} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[52, 52]} />
          <meshBasicMaterial
            map={milkyWayTexture}
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ── 2. Supermassive Galactic Core Radiant Energy Halo ── */}
      {coreGlowTexture && (
        <mesh ref={coreGlowRef} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14, 14]} />
          <meshBasicMaterial
            map={coreGlowTexture}
            transparent
            opacity={0.92}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── 3. Volumetric 3D Spiral Arm Star Dust & Nebular Clusters ── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          vertexColors
          color="#FFFFFF"
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. SATURN RING GEOMETRY WITH AUTHENTIC UV MAPPING
// ═══════════════════════════════════════════════════════════════════════════
function createSaturnRingGeometry(inner: number, outer: number, segments = 64) {
  const geo = new THREE.BufferGeometry()
  const vertices: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const cos = Math.cos(theta)
    const sin = Math.sin(theta)

    vertices.push(inner * cos, 0, inner * sin)
    uvs.push(0, i / segments)

    vertices.push(outer * cos, 0, outer * sin)
    uvs.push(1, i / segments)
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2
    const b = a + 1
    const c = a + 2
    const d = a + 3
    indices.push(a, b, c)
    indices.push(c, b, d)
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. REAL COSMIC PLANET (100% Solid & Opaque — NO Outer Edge Circle/Glow!)
// ═══════════════════════════════════════════════════════════════════════════
export type PlanetDirection =
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'bottom-right-to-top-left'
  | 'top-left-to-bottom-right'

interface PlanetConfig {
  id: string;
  name: string;
  texture: string;
  ringTexture?: string;
  hasMoon?: boolean;
  moonTexture?: string;
  isSun?: boolean;
  radius: number;
  axialTilt: number;
  rotSpeed: number;
  speed: number;
  direction: PlanetDirection;
  baseX: number;
  relativeY: number;
  baseZ: number;
  waveAmp: number;
  timeOffset: number;
}

interface PlanetRenderProps extends PlanetConfig {
  mouseRay?: THREE.Ray;
  externalOffset: THREE.Vector3;
  onPositionUpdate: (pos: THREE.Vector3) => void;
}

function RealCosmicPlanet(props: PlanetRenderProps) {
  const {
    texture: texPath,
    ringTexture: ringPath,
    hasMoon = false,
    moonTexture: moonPath,
    isSun = false,
    radius,
    axialTilt,
    rotSpeed,
    speed,
    direction,
    baseX,
    relativeY,
    baseZ,
    waveAmp,
    timeOffset,
    mouseRay,
    externalOffset,
    onPositionUpdate,
  } = props

  const { camera } = useThree()
  const groupRef = useRef<any>(null)
  const sphereRef = useRef<any>(null)
  const moonRef = useRef<any>(null)
  const ringRef = useRef<any>(null)
  const sunLightRef = useRef<any>(null)

  // Fluid zero-gravity physics state
  const dodgeOffset = useRef(new THREE.Vector3(0, 0, 0))
  const spinAcceleration = useRef(0)
  const tiltWobble = useRef({ rx: 0, rz: 0 })
  const currentAngle = useRef(0)

  const texture = useMemo(() => getPlanetTexture(texPath), [texPath])
  const moonTex = useMemo(() => (moonPath ? getPlanetTexture(moonPath) : null), [moonPath])
  const ringTex = useMemo(() => (ringPath ? getPlanetTexture(ringPath) : null), [ringPath])

  const ringGeo = useMemo(() => {
    if (!ringPath) return null
    return createSaturnRingGeometry(radius * 1.25, radius * 2.30, 96)
  }, [ringPath, radius])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    const dt = Math.min(delta, 0.05)

    let targetX = baseX
    let targetY = camera.position.y + relativeY
    let targetZ = baseZ
    let isSunActive = true

    if (isSun) {
      // ── Dedicated Sun Transit & Time-Lapse Cycle ──
      // The sun moves noticeably faster across the upper celestial sky so it doesn't linger behind foreground font.
      // After crossing the sky in ~18 seconds, it rests offscreen during a 42-second time-lapse phase before returning.
      const SUN_TRANSIT_DURATION = 18 // Seconds across sky (~4.0 units/sec, brisk and majestic)
      const SUN_LAPSE_DURATION = 42   // Seconds of offscreen time-lapse (foreground font remains 100% unobstructed)
      const SUN_TOTAL_CYCLE = SUN_TRANSIT_DURATION + SUN_LAPSE_DURATION // 60s total cycle

      const sunCycleTime = ((t + timeOffset * SUN_TOTAL_CYCLE) % SUN_TOTAL_CYCLE + SUN_TOTAL_CYCLE) % SUN_TOTAL_CYCLE

      if (sunCycleTime < SUN_TRANSIT_DURATION) {
        // Active transit phase across the upper celestial sky
        const progress = sunCycleTime / SUN_TRANSIT_DURATION
        targetX = -36 + progress * 72
        targetY = camera.position.y + relativeY + Math.sin(progress * Math.PI) * waveAmp
        targetZ = baseZ + Math.cos(progress * Math.PI) * 1.5

        // Smooth lighting intensity envelope during transit
        const edgeWindow = 0.15
        let lightFade = 1.0
        if (progress < edgeWindow) {
          lightFade = progress / edgeWindow
        } else if (progress > 1.0 - edgeWindow) {
          lightFade = (1.0 - progress) / edgeWindow
        }
        if (sunLightRef.current) {
          sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, 4.0 * lightFade, 0.1)
        }
      } else {
        // Time-lapse phase: Sun rests offscreen so user can read text with zero distraction
        isSunActive = false
        targetX = 999
        targetY = camera.position.y + relativeY
        targetZ = baseZ
        if (sunLightRef.current) {
          sunLightRef.current.intensity = 0
        }
      }
    } else {
      // ── Directional Trajectories: Far Offscreen-to-Offscreen (NEVER Pops or Disappears On Screen) ──
      const progress = ((t * speed + timeOffset) % 1 + 1) % 1
      const SPAN_X = 68 // Starts at -34, exits at +34
      const SPAN_Y = 42 // Starts at -21, exits at +21

      switch (direction) {
        case 'left-to-right': {
          targetX = -34 + progress * SPAN_X
          targetY += Math.sin(progress * Math.PI * 2) * waveAmp
          targetZ += Math.cos(progress * Math.PI) * 1.5
          break
        }
        case 'right-to-left': {
          targetX = 34 - progress * SPAN_X
          targetY += Math.cos(progress * Math.PI * 2) * waveAmp
          targetZ += Math.sin(progress * Math.PI) * 1.5
          break
        }
        case 'top-to-bottom': {
          targetY = camera.position.y + 21 - progress * SPAN_Y
          targetX = baseX + Math.sin(progress * Math.PI * 2) * waveAmp
          break
        }
        case 'bottom-to-top': {
          targetY = camera.position.y - 21 + progress * SPAN_Y
          targetX = baseX + Math.cos(progress * Math.PI * 2) * waveAmp
          break
        }
        case 'bottom-right-to-top-left': {
          targetX = 34 - progress * SPAN_X
          targetY = camera.position.y - 21 + progress * SPAN_Y + Math.sin(progress * Math.PI * 2) * waveAmp
          break
        }
        case 'top-left-to-bottom-right': {
          targetX = -34 + progress * SPAN_X
          targetY = camera.position.y + 21 - progress * SPAN_Y + Math.cos(progress * Math.PI * 2) * waveAmp
          break
        }
      }
    }

    // ── B. Smooth Zero-Gravity Interactive Proximity Physics ──
    const totalX = targetX + dodgeOffset.current.x + externalOffset.x
    const totalY = targetY + dodgeOffset.current.y + externalOffset.y
    const totalZ = targetZ + dodgeOffset.current.z + externalOffset.z

    const currentPos = new THREE.Vector3(totalX, totalY, totalZ)
    if (isSun && !isSunActive) {
      onPositionUpdate(new THREE.Vector3(999, 999, 999))
    } else {
      onPositionUpdate(currentPos)
    }

    let distToRay = 999
    let closestRayPoint = new THREE.Vector3()

    if (mouseRay && (!isSun || isSunActive)) {
      const diff = new THREE.Vector3().subVectors(currentPos, mouseRay.origin)
      const proj = Math.max(0, diff.dot(mouseRay.direction))
      closestRayPoint.copy(mouseRay.origin).addScaledVector(mouseRay.direction, proj)
      distToRay = currentPos.distanceTo(closestRayPoint)
    }

    const INTERACTION_ZONE = radius * 3.2

    if (distToRay < INTERACTION_ZONE) {
      // Smooth cubic-ease proximity factor
      const p = 1 - distToRay / INTERACTION_ZONE
      const smoothFactor = p * p * (3 - 2 * p)

      // 1. Smooth spin acceleration (ramps up to 3.0x with fluid momentum)
      spinAcceleration.current = THREE.MathUtils.lerp(spinAcceleration.current, smoothFactor * 3.0, 0.12)

      // 2. Smooth zero-gravity repulsion deflection (glides smoothly away with zero jitter)
      const repelDir = new THREE.Vector3().subVectors(currentPos, closestRayPoint)
      if (repelDir.lengthSq() > 0.0001) {
        repelDir.normalize()
        const targetDeflectX = repelDir.x * smoothFactor * (radius * 2.6)
        const targetDeflectY = repelDir.y * smoothFactor * (radius * 2.6)
        const targetDeflectZ = repelDir.z * smoothFactor * (radius * 1.4)

        dodgeOffset.current.x = THREE.MathUtils.lerp(dodgeOffset.current.x, targetDeflectX, 0.08)
        dodgeOffset.current.y = THREE.MathUtils.lerp(dodgeOffset.current.y, targetDeflectY, 0.08)
        dodgeOffset.current.z = THREE.MathUtils.lerp(dodgeOffset.current.z, targetDeflectZ, 0.08)

        // 3. Smooth gyroscopic 3D tilt on polar axis
        tiltWobble.current.rx = THREE.MathUtils.lerp(tiltWobble.current.rx, repelDir.y * smoothFactor * 0.25, 0.08)
        tiltWobble.current.rz = THREE.MathUtils.lerp(tiltWobble.current.rz, -repelDir.x * smoothFactor * 0.25, 0.08)
      }
    } else {
      // Smooth zero-g return to trajectory
      spinAcceleration.current = THREE.MathUtils.lerp(spinAcceleration.current, 0, 0.04)
      dodgeOffset.current.x = THREE.MathUtils.lerp(dodgeOffset.current.x, 0, 0.04)
      dodgeOffset.current.y = THREE.MathUtils.lerp(dodgeOffset.current.y, 0, 0.04)
      dodgeOffset.current.z = THREE.MathUtils.lerp(dodgeOffset.current.z, 0, 0.04)
      tiltWobble.current.rx = THREE.MathUtils.lerp(tiltWobble.current.rx, 0, 0.04)
      tiltWobble.current.rz = THREE.MathUtils.lerp(tiltWobble.current.rz, 0, 0.04)
    }

    // ── C. Smooth Dynamic Continuous Rotation with Momentum ──
    const effectiveRotSpeed = rotSpeed * (1.0 + spinAcceleration.current)
    currentAngle.current += effectiveRotSpeed * dt

    if (sphereRef.current) sphereRef.current.rotation.y = currentAngle.current

    // Orbiting Moon physics
    if (moonRef.current && hasMoon) {
      const moonDist = radius * 3.2
      const moonSpeed = 1.2 * (1.0 + spinAcceleration.current * 1.5)
      moonRef.current.position.set(
        Math.cos(t * moonSpeed) * moonDist,
        Math.sin(t * 0.8) * 0.25,
        Math.sin(t * moonSpeed) * moonDist
      )
      moonRef.current.rotation.y = t * 0.4
    }

    // Saturn 3D Ring smooth gyroscopic micro-motion concentric with equator
    if (ringRef.current && ringGeo) {
      const ringWobble = Math.sin(t * 1.4 + spinAcceleration.current * 2) * 0.02
      ringRef.current.rotation.set(0, 0, ringWobble)
    }

    // ── D. Group Transform ──
    if (groupRef.current) {
      if (isSun) {
        groupRef.current.visible = isSunActive
      }
      if (!isSun || isSunActive) {
        groupRef.current.position.set(totalX, totalY, totalZ)
        groupRef.current.rotation.x = axialTilt + tiltWobble.current.rx
        groupRef.current.rotation.z = tiltWobble.current.rz
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* 1. SOLID OPAQUE PLANET SPHERE / AUTHENTIC TEXTURED SUN */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture || undefined}
          roughness={isSun ? 0.9 : 0.75}
          metalness={isSun ? 0.0 : 0.06}
          emissive={isSun ? '#FF5500' : '#000000'}
          emissiveMap={isSun && texture ? texture : undefined}
          emissiveIntensity={isSun ? 0.85 : 0}
          transparent={false}
          depthWrite={true}
        />
      </mesh>

      {/* Radiant Solar Corona Glow for the Sun — Multi-layered, ethereal, and authentic */}
      {isSun && (
        <>
          {/* Inner solar flare corona */}
          <mesh>
            <sphereGeometry args={[radius * 1.05, 32, 32]} />
            <meshBasicMaterial
              color="#FF5722"
              transparent
              opacity={0.24}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Outer ethereal golden solar corona */}
          <mesh>
            <sphereGeometry args={[radius * 1.20, 32, 32]} />
            <meshBasicMaterial
              color="#FFA000"
              transparent
              opacity={0.10}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      {/* 2. Saturn Authentic Concentric Rings */}
      {ringGeo && (
        <mesh ref={ringRef} geometry={ringGeo} rotation={[0, 0, 0]}>
          <meshStandardMaterial
            map={ringTex || undefined}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.92}
            roughness={0.65}
            metalness={0.05}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. Orbiting Luna (Moon) */}
      {hasMoon && (
        <mesh ref={moonRef}>
          <sphereGeometry args={[radius * 0.27, 24, 24]} />
          <meshStandardMaterial
            map={moonTex || undefined}
            roughness={0.92}
            metalness={0.05}
            transparent={false}
            depthWrite={true}
          />
        </mesh>
      )}

      {/* 4. Dynamic Warm Sunlight from the Moving 3D Sun */}
      {isSun && (
        <pointLight ref={sunLightRef} color="#FFF4D0" intensity={4.0} distance={110} decay={1.0} />
      )}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. PLANETARY FLEET — DEDICATED CORRIDORS & MUTUAL ANTI-COLLISION REPULSION
// ═══════════════════════════════════════════════════════════════════════════
function PlanetaryFleet({ mouseRay }: { mouseRay: THREE.Ray }) {
  // Every planet travels in a distinct direction and dedicated spatial corridor,
  // preventing clumping and collisions across all sections of the portfolio:
    const configs = useMemo<PlanetConfig[]>(() => [
    // 0. Sun: The glorious 3D rotating star, floating Left-to-Right across high celestial dome
    {
      id: 'sun', name: 'Sun', texture: '/textures/planets/sun.jpg',
      isSun: true, radius: 2.2, axialTilt: 0.12, rotSpeed: 0.16,
      speed: 0.05, direction: 'left-to-right',
      baseX: 0, relativeY: 5.4, baseZ: -15.0, waveAmp: 0.4, timeOffset: 0.10,
    },
    // 1. Mercury: Swift cratered terrestrial planet in the highest celestial corridor
    {
      id: 'mercury', name: 'Mercury', texture: '/textures/planets/mercury.jpg',
      radius: 0.70, axialTilt: 0.03, rotSpeed: 0.35,
      speed: 0.024, direction: 'left-to-right',
      baseX: 0, relativeY: 7.2, baseZ: -8.5, waveAmp: 0.5, timeOffset: 0.70,
    },
    // 2. Venus: Golden veiled terrestrial planet descending on the far left peripheral corridor
    {
      id: 'venus', name: 'Venus', texture: '/textures/planets/venus.jpg',
      radius: 0.95, axialTilt: 3.1, rotSpeed: -0.28,
      speed: 0.016, direction: 'top-to-bottom',
      baseX: -19.0, relativeY: 0, baseZ: -11.0, waveAmp: 0.6, timeOffset: 0.35,
    },
    // 3. Earth + Luna: Majestic blue marble with orbiting Moon cruising Right-to-Left in upper-mid space
    {
      id: 'earth', name: 'Earth',
      texture: '/textures/planets/earth_day.jpg',
      hasMoon: true, moonTexture: '/textures/planets/moon.jpg',
      radius: 1.15, axialTilt: 0.41, rotSpeed: 0.36,
      speed: 0.017, direction: 'right-to-left',
      baseX: 0, relativeY: 2.4, baseZ: -8.8, waveAmp: 0.6, timeOffset: 0.50,
    },
    // 4. Mars: The Red Planet ascending in the far right peripheral corridor
    {
      id: 'mars', name: 'Mars', texture: '/textures/planets/mars.jpg',
      radius: 0.85, axialTilt: 0.44, rotSpeed: 0.32,
      speed: 0.019, direction: 'bottom-to-top',
      baseX: 19.0, relativeY: 0, baseZ: -10.5, waveAmp: 0.6, timeOffset: 0.85,
    },
    // 5. Jupiter: Massive storm banded gas giant cruising Right-to-Left in mid-lower space
    {
      id: 'jupiter', name: 'Jupiter', texture: '/textures/planets/jupiter.jpg',
      radius: 1.55, axialTilt: 0.05, rotSpeed: 0.45,
      speed: 0.014, direction: 'right-to-left',
      baseX: 0, relativeY: -2.2, baseZ: -13.5, waveAmp: 0.6, timeOffset: 0.20,
    },
    // 6. Saturn: The ringed jewel cruising Left-to-Right in deep lower corridor
    {
      id: 'saturn', name: 'Saturn',
      texture: '/textures/planets/saturn.jpg',
      ringTexture: '/textures/planets/saturn_ring.png',
      radius: 1.10, axialTilt: 0.47, rotSpeed: 0.40,
      speed: 0.015, direction: 'left-to-right',
      baseX: 0, relativeY: -6.0, baseZ: -11.5, waveAmp: 0.5, timeOffset: 0.60,
    },
    // 7. Uranus: Aquamarine ice giant floating in deep background diagonal space
    {
      id: 'uranus', name: 'Uranus', texture: '/textures/planets/uranus.jpg',
      radius: 1.05, axialTilt: 1.71, rotSpeed: -0.30,
      speed: 0.013, direction: 'bottom-right-to-top-left',
      baseX: 0, relativeY: 0, baseZ: -18.5, waveAmp: 0.8, timeOffset: 0.90,
    },
    // 8. Neptune: Deep cobalt blue giant floating in deepest cosmic background
    {
      id: 'neptune', name: 'Neptune', texture: '/textures/planets/neptune.jpg',
      radius: 0.95, axialTilt: 0.50, rotSpeed: 0.32,
      speed: 0.012, direction: 'top-left-to-bottom-right',
      baseX: 0, relativeY: 0, baseZ: -22.0, waveAmp: 0.8, timeOffset: 0.40,
    },
  ], [])

  // Position tracking & mutual collision avoidance
  const positionsRef = useRef<Record<string, THREE.Vector3>>({})
  const antiCollisionOffsets = useRef<Record<string, THREE.Vector3>>({})

  useEffect(() => {
    configs.forEach((c) => {
      positionsRef.current[c.id] = new THREE.Vector3(0, 0, 0)
      antiCollisionOffsets.current[c.id] = new THREE.Vector3(0, 0, 0)
    })
  }, [configs])

  useFrame(() => {
    // Pairwise 3D & 2D anti-collision repulsion: ensures planets maintain clear distance and never collide
    const ids = configs.map((c) => c.id)
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const idA = ids[i]
        const idB = ids[j]
        const posA = positionsRef.current[idA]
        const posB = positionsRef.current[idB]
        if (!posA || !posB) continue

        // Ignore if either planet is parked offscreen or beyond bounds
        if (posA.x > 500 || posB.x > 500 || Math.abs(posA.x) > 38 || Math.abs(posB.x) > 38) continue

        const cfgA = configs[i]
        const cfgB = configs[j]
        const effRadA = cfgA.ringTexture ? cfgA.radius * 2.3 : cfgA.radius
        const effRadB = cfgB.ringTexture ? cfgB.radius * 2.3 : cfgB.radius

        // 1. 3D Spatial Separation Buffer (generous separation distance)
        const minDist3D = effRadA + effRadB + 7.5
        const dist3D = posA.distanceTo(posB)

        if (dist3D < minDist3D && dist3D > 0.001) {
          const overlap = minDist3D - dist3D
          const push3D = new THREE.Vector3().subVectors(posA, posB).normalize().multiplyScalar(overlap * 0.22)
          antiCollisionOffsets.current[idA]?.add(push3D)
          antiCollisionOffsets.current[idB]?.sub(push3D)
        }

        // 2. 2D Visual Screen Separation (ensures planets never visually overlap on screen)
        const dx = posA.x - posB.x
        const dy = posA.y - posB.y
        const dist2D = Math.sqrt(dx * dx + dy * dy)
        const minDist2D = effRadA + effRadB + 5.5

        if (dist2D < minDist2D && dist2D > 0.001) {
          const overlap2D = minDist2D - dist2D
          const pushX = (dx / dist2D) * overlap2D * 0.18
          const pushY = (dy / dist2D) * overlap2D * 0.18
          const push2D = new THREE.Vector3(pushX, pushY, 0)
          antiCollisionOffsets.current[idA]?.add(push2D)
          antiCollisionOffsets.current[idB]?.sub(push2D)
        }
      }
    }

    // Smooth spring return for anti-collision offsets
    ids.forEach((id) => {
      antiCollisionOffsets.current[id]?.lerp(new THREE.Vector3(0, 0, 0), 0.035)
    })
  })

  return (
    <group>
      {configs.map((cfg) => (
        <RealCosmicPlanet
          key={cfg.id}
          {...cfg}
          mouseRay={mouseRay}
          externalOffset={antiCollisionOffsets.current[cfg.id] || new THREE.Vector3(0, 0, 0)}
          onPositionUpdate={(pos) => {
            if (positionsRef.current[cfg.id]) {
              positionsRef.current[cfg.id].copy(pos)
            }
          }}
        />
      ))}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. 3D ALIEN SPACESHIPS (Smooth Dynamic Cruising — NO CURSOR GLITCH!)
// ═══════════════════════════════════════════════════════════════════════════
function AlienSpaceships() {
  const { camera } = useThree()
  const ships = useMemo(() => [
    {
      id: 1,
      speed: 0.28,
      radiusX: 16.0,
      radiusY: 3.5,
      radiusZ: 7.0,
      relativeY: 2.2,
      color: '#FFB300', // Solar Gold Cruiser
      trailColor: '#FF6D00',
      phase: 0,
      scale: 0.22,
    },
    {
      id: 2,
      speed: 0.22,
      radiusX: 18.0,
      radiusY: 4.5,
      radiusZ: 8.5,
      relativeY: -2.2,
      color: '#FF1744', // Cyber Crimson Scout
      trailColor: '#FF4081',
      phase: Math.PI * 0.8,
      scale: 0.18,
    },
    {
      id: 3,
      speed: 0.32,
      radiusX: 14.0,
      radiusY: 3.0,
      radiusZ: 7.5,
      relativeY: 0.0,
      color: '#00E676', // Bio-Emerald Interceptor
      trailColor: '#00E5FF',
      phase: Math.PI * 1.5,
      scale: 0.20,
    },
  ], [])

  const shipMeshes = useRef<any[]>([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ships.forEach((ship, idx) => {
      const mesh = shipMeshes.current[idx]
      if (!mesh) return

      const angle = t * ship.speed + ship.phase
      const baseX = Math.cos(angle) * ship.radiusX
      const baseY = camera.position.y + ship.relativeY + Math.sin(angle * 1.8) * ship.radiusY
      const baseZ = Math.sin(angle) * ship.radiusZ - 8.5

      mesh.position.set(baseX, baseY, baseZ)

      // Natural bank and turn into flight velocity
      const tangentX = -Math.sin(angle)
      const tangentZ = Math.cos(angle)
      mesh.rotation.y = Math.atan2(tangentX, tangentZ)
      mesh.rotation.z = Math.sin(angle * 2.2) * 0.25
      mesh.rotation.x = Math.cos(angle * 1.8) * 0.15
    })
  })

  return (
    <group>
      {ships.map((ship, idx) => (
        <group
          key={ship.id}
          ref={(el) => { shipMeshes.current[idx] = el }}
          scale={[ship.scale, ship.scale, ship.scale]}
        >
          {/* Aerodynamic Saucer Hull */}
          <mesh>
            <cylinderGeometry args={[1.2, 0.4, 0.32, 16]} />
            <meshStandardMaterial
              color="#101322"
              emissive={ship.color}
              emissiveIntensity={0.5}
              metalness={0.95}
              roughness={0.2}
              transparent
              opacity={0.94}
            />
          </mesh>
          {/* Cockpit Canopy */}
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.5, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial
              color={ship.color}
              emissive={ship.color}
              emissiveIntensity={0.85}
              transparent
              opacity={0.94}
            />
          </mesh>
          {/* Ion Engine Thruster Cone */}
          <mesh position={[0, -0.2, 0]}>
            <coneGeometry args={[0.4, 0.32, 14]} />
            <meshBasicMaterial
              color={ship.trailColor}
              transparent
              opacity={0.88}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Antigravity Warp Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.04, 6, 20]} />
            <meshBasicMaterial
              color={ship.color}
              transparent
              opacity={0.70}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color={ship.color} intensity={1.2} distance={7} />
        </group>
      ))}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. DYNAMIC MULTI-SPECTRUM SHOOTING METEORS
// ═══════════════════════════════════════════════════════════════════════════
function Meteors({ count = 8 }: { count?: number }) {
  const { camera } = useThree()
  const meteorsRef = useRef<any>(null)

  const [meteorData] = useState(() => {
    const meteorColors = [
      { head: new THREE.Color('#FFD700'), tail: new THREE.Color('#FF6D00') }, // Solar Gold
      { head: new THREE.Color('#00E676'), tail: new THREE.Color('#00BFA5') }, // Aurora Emerald
      { head: new THREE.Color('#FF1744'), tail: new THREE.Color('#FF5252') }, // Ruby Fireball
      { head: new THREE.Color('#E040FB'), tail: new THREE.Color('#7C4DFF') }, // Cosmic Violet
      { head: new THREE.Color('#FFFFFF'), tail: new THREE.Color('#80D8FF') }, // Diamond Ice
      { head: new THREE.Color('#FF4081'), tail: new THREE.Color('#FF80AB') }, // Rose
    ]

    return Array.from({ length: count }, (_, idx) => {
      const palette = meteorColors[idx % meteorColors.length]
      return {
        x: (Math.random() - 0.5) * 44,
        relativeY: 8 + Math.random() * 8,
        z: -4 - Math.random() * 14,
        speedX: -(0.35 + Math.random() * 0.45),
        speedY: -(0.3 + Math.random() * 0.4),
        length: 2.5 + Math.random() * 3.2,
        delay: Math.random() * 3.5,
        active: false,
        timer: Math.random() * 3,
        headColor: palette.head,
        tailColor: palette.tail,
      }
    })
  })

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 6)
    const col = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const m = meteorData[i]
      pos[i * 6] = 0; pos[i * 6 + 1] = 0; pos[i * 6 + 2] = 0
      pos[i * 6 + 3] = 0; pos[i * 6 + 4] = 0; pos[i * 6 + 5] = 0
      col[i * 6] = m.headColor.r; col[i * 6 + 1] = m.headColor.g; col[i * 6 + 2] = m.headColor.b
      col[i * 6 + 3] = m.tailColor.r * 0.1; col[i * 6 + 4] = m.tailColor.g * 0.1; col[i * 6 + 5] = m.tailColor.b * 0.1
    }
    return [pos, col]
  }, [count, meteorData])

  useFrame((_, delta) => {
    if (!meteorsRef.current) return
    const posAttr = meteorsRef.current.geometry.attributes.position
    const posArray = posAttr.array

    meteorData.forEach((m, i) => {
      m.timer += delta
      if (!m.active && m.timer >= m.delay) {
        m.active = true
        m.x = 16 + Math.random() * 18
        m.relativeY = 7 + Math.random() * 6
        m.z = -3 - Math.random() * 10
      }
      if (m.active) {
        m.x += m.speedX
        m.relativeY += m.speedY
        const actualY = camera.position.y + m.relativeY
        posArray[i * 6] = m.x
        posArray[i * 6 + 1] = actualY
        posArray[i * 6 + 2] = m.z
        posArray[i * 6 + 3] = m.x - m.speedX * m.length * 2.2
        posArray[i * 6 + 4] = actualY - m.speedY * m.length * 2.2
        posArray[i * 6 + 5] = m.z

        if (m.relativeY < -12 || m.x < -24) {
          m.active = false
          m.timer = 0
          m.delay = 1.2 + Math.random() * 4.0
          posArray[i * 6] = 0; posArray[i * 6 + 1] = 0; posArray[i * 6 + 2] = 0
          posArray[i * 6 + 3] = 0; posArray[i * 6 + 4] = 0; posArray[i * 6 + 5] = 0
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
        color="#FFFFFF"
        transparent
        opacity={0.88}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. ASTEROID BELT (Real 3D Natural Rock Facets)
// ═══════════════════════════════════════════════════════════════════════════
function AsteroidBelt({ count = 75, mouseRay }: { count?: number; mouseRay?: THREE.Ray }) {
  const { camera } = useThree()
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const asteroids = useMemo(() => {
    const tones = [
      new THREE.Color('#8D6E63'), // Chondrite bronze
      new THREE.Color('#6D4C41'), // Deep basalt
      new THREE.Color('#795548'), // Iron oxide brown
      new THREE.Color('#A1887F'), // Copper fleck rock
      new THREE.Color('#616161'), // Charcoal granite
      new THREE.Color('#BCAAA4'), // Light mineral dust
    ]

    return Array.from({ length: count }, () => {
      const radius = 10 + Math.random() * 20
      const angle = Math.random() * Math.PI * 2
      const relativeY = (Math.random() - 0.5) * 9
      const scale = 0.08 + Math.random() * 0.18
      const rotSpeedX = (Math.random() - 0.5) * 0.35
      const rotSpeedY = (Math.random() - 0.5) * 0.45
      const orbitSpeed = 0.02 + Math.random() * 0.03
      const color = tones[Math.floor(Math.random() * tones.length)]
      return { radius, angle, relativeY, scale, rotSpeedX, rotSpeedY, orbitSpeed, color, scatterOffset: new THREE.Vector3(0, 0, 0) }
    })
  }, [count])

  useEffect(() => {
    if (meshRef.current) {
      asteroids.forEach((ast, i) => {
        meshRef.current?.setColorAt(i, ast.color)
      })
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true
      }
    }
  }, [asteroids])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    asteroids.forEach((ast, i) => {
      const currentAngle = ast.angle + t * ast.orbitSpeed
      const baseX = Math.cos(currentAngle) * ast.radius
      const baseY = camera.position.y + ast.relativeY + Math.sin(t * 0.3 + i) * 0.25
      const baseZ = Math.sin(currentAngle) * ast.radius - 10

      // Smooth proximity deflection with cursor
      if (mouseRay) {
        const astPos = new THREE.Vector3(baseX, baseY, baseZ).add(ast.scatterOffset)
        const diff = new THREE.Vector3().subVectors(astPos, mouseRay.origin)
        const proj = Math.max(0, diff.dot(mouseRay.direction))
        const closestPoint = mouseRay.origin.clone().addScaledVector(mouseRay.direction, proj)
        const dist = astPos.distanceTo(closestPoint)

        if (dist < 2.6) {
          const smooth = 1 - dist / 2.6
          const push = new THREE.Vector3().subVectors(astPos, closestPoint).normalize().multiplyScalar(smooth * 0.12)
          ast.scatterOffset.add(push)
        }
      }
      ast.scatterOffset.lerp(new THREE.Vector3(0, 0, 0), 0.05)

      dummy.position.set(
        baseX + ast.scatterOffset.x,
        baseY + ast.scatterOffset.y,
        baseZ + ast.scatterOffset.z
      )
      dummy.rotation.set(t * ast.rotSpeedX, t * ast.rotSpeedY, t * 0.1)
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
        roughness={0.88}
        metalness={0.15}
        transparent={false}
        depthWrite={true}
      />
    </instancedMesh>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. AUTHENTIC COSMIC ILLUMINATION
// ═══════════════════════════════════════════════════════════════════════════
function CosmicLighting() {
  return (
    <>
      <ambientLight intensity={0.52} color="#FFFFFF" />
      <directionalLight position={[15, 12, 10]} intensity={0.90} color="#FFF8E7" />
      <directionalLight position={[-15, -8, 6]} intensity={0.40} color="#FFE0B2" />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. EXPANSIVE 3D SPACE FLIGHT RIG
// ═══════════════════════════════════════════════════════════════════════════
function CosmicFlightRigFull() {
  const { camera, mouse } = useThree()
  const scrollRef = useRef(0)
  const cachedTarget = useRef({ x: 0, y: 0, z: 9.5, rx: 0, ry: 0, rz: 0 })

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Gentle organic floating drift in zero gravity
    const floatX = Math.sin(t * 0.18) * 0.65 + Math.cos(t * 0.11) * 0.30
    const floatY = Math.cos(t * 0.14) * 0.55 + Math.sin(t * 0.09) * 0.25
    const floatZ = Math.sin(t * 0.08) * 0.40 + Math.cos(t * 0.06) * 0.20

    // Smooth cosmic scroll parallax
    const maxScroll = Math.max(1, (document.body?.scrollHeight || 3000) - window.innerHeight)
    const scrollProgress = scrollRef.current / maxScroll
    const scrollY = -(scrollProgress * 6.5)

    // Depth journey
    const depthCurve = Math.sin(scrollProgress * Math.PI) * 1.5
    const targetZ = 9.5 + depthCurve + floatZ

    // Unbounded Cursor Cosmic Free-Look
    const panRangeX = mouse.x * 5.2 + floatX
    const panRangeY = mouse.y * 3.4 + floatY + scrollY

    cachedTarget.current.x = panRangeX
    cachedTarget.current.y = panRangeY
    cachedTarget.current.z = targetZ

    // Look-around rotation
    cachedTarget.current.rx = mouse.y * 0.14 + Math.sin(t * 0.12) * 0.015
    cachedTarget.current.ry = -mouse.x * 0.18 + Math.cos(t * 0.14) * 0.015
    cachedTarget.current.rz = -mouse.x * 0.06 + Math.sin(t * 0.18) * 0.010

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

// ═══════════════════════════════════════════════════════════════════════════
// 11. COSMIC SCENE & MAIN CANVAS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function CosmicScene() {
  const { mouse, camera } = useThree()
  const textures = useCosmicTextures()

  // High-precision 3D Mouse Raycaster for accurate interaction at any scroll depth
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouseRay = useRef(new THREE.Ray()).current

  useEffect(() => {
    const onPointerMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [mouse])

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera)
    mouseRay.origin.copy(raycaster.ray.origin)
    mouseRay.direction.copy(raycaster.ray.direction)
  })

  return (
    <>
      <CosmicLighting />
      <CosmicFlightRigFull />
      <SpiralGalaxy />
      {/* 1. Rich vibrant floating cosmic stardust throughout the whole space */}
      <CosmicStardust count={8500} texture={textures.star} />
      {/* Warp star streaming */} 
      <WarpStarfield count={1200} texture={textures.star} />
      {/* 2. Deep space starry drift */}
      <DeepFieldStars count={5500} texture={textures.star} />
      {/* 3. Pulsating jewel stars that brighten and diminish */}
      <BrighteningDiminishingSparkles count={500} texture={textures.star} />
      {/* 4. Glowing multi-color point stars */}
      <GlowingPointStars count={380} texture={textures.glowingPoint} />
      {/* 5. Radiant anamorphic starbursts */}
      <StarburstFocalStars count={35} texture={textures.starburst} />
      {/* 6. Geometric constellation line networks */}
      <ConstellationNetwork count={50} />
      {/* 7. Dedicated-corridor planetary fleet with anti-collision physics */}
      <PlanetaryFleet mouseRay={mouseRay} />
      {/* 8. Alien cruisers cruising smoothly in 3D */}
      <AlienSpaceships />
      {/* 9. Streaking shooting stars */}
      <Meteors count={8} />
      {/* 10. 3D natural rock asteroids */}
      <AsteroidBelt count={75} mouseRay={mouseRay} />
    </>
  )
}

export default function ParticleField() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 60, near: 0.1, far: 1200 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <Suspense fallback={null}>
          <CosmicScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
