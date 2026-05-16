'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 1800 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const { mouse } = useThree()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cyan = new THREE.Color('#00E5FF')
    const violet = new THREE.Color('#7C3AED')
    const white = new THREE.Color('#ffffff')

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 28
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14

      const r = Math.random()
      const baseColor = r < 0.45 ? cyan : r < 0.75 ? violet : white
      const alpha = 0.4 + Math.random() * 0.6
      col[i * 3]     = baseColor.r * alpha
      col[i * 3 + 1] = baseColor.g * alpha
      col[i * 3 + 2] = baseColor.b * alpha
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()

    // Slow drift rotation
    mesh.current.rotation.y = t * 0.018
    mesh.current.rotation.x = Math.sin(t * 0.008) * 0.12

    // Subtle mouse parallax
    mesh.current.position.x = mouse.x * 0.6
    mesh.current.position.y = mouse.y * 0.4
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function NeuralLines({ count = 80 }: { count?: number }) {
  const linesRef = useRef<THREE.LineSegments>(null)

  const [positions, lineColors] = useMemo(() => {
    const pts: number[] = []
    const cols: number[] = []
    const cyan = new THREE.Color('#00E5FF')
    const violet = new THREE.Color('#7C3AED')

    for (let i = 0; i < count; i++) {
      const x1 = (Math.random() - 0.5) * 20
      const y1 = (Math.random() - 0.5) * 16
      const z1 = (Math.random() - 0.5) * 10
      const x2 = x1 + (Math.random() - 0.5) * 4
      const y2 = y1 + (Math.random() - 0.5) * 4
      const z2 = z1 + (Math.random() - 0.5) * 4
      pts.push(x1, y1, z1, x2, y2, z2)

      const c = Math.random() > 0.5 ? cyan : violet
      const alpha = 0.08 + Math.random() * 0.12
      cols.push(c.r * alpha, c.g * alpha, c.b * alpha)
      cols.push(c.r * alpha, c.g * alpha, c.b * alpha)
    }
    return [new Float32Array(pts), new Float32Array(cols)]
  }, [count])

  useFrame(({ clock }) => {
    if (!linesRef.current) return
    linesRef.current.rotation.y = clock.getElapsedTime() * 0.010
    linesRef.current.rotation.z = clock.getElapsedTime() * 0.005
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.5} depthWrite={false} />
    </lineSegments>
  )
}

function FloatingOrb({ position, color, size = 1.2, speed = 0.4 }: {
  position: [number, number, number]
  color: string
  size?: number
  speed?: number
}) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime() * speed
    mesh.current.position.y = position[1] + Math.sin(t) * 0.6
    mesh.current.position.x = position[0] + Math.cos(t * 0.7) * 0.3
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.035} depthWrite={false} />
    </mesh>
  )
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 65 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Particles count={1600} />
      <NeuralLines count={70} />
      <FloatingOrb position={[-6, 3, -4]} color="#00E5FF" size={2.5} speed={0.3} />
      <FloatingOrb position={[7, -2, -6]} color="#7C3AED" size={3} speed={0.2} />
      <FloatingOrb position={[2, 5, -8]} color="#FF6B2B" size={2} speed={0.35} />
    </Canvas>
  )
}
