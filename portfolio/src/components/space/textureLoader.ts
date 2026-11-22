// src/components/space/textureLoader.ts
import * as THREE from 'three'

const textureCache = new Map<string, THREE.Texture>()

export function getPlanetTexture(url: string): THREE.Texture {
  if (typeof window === 'undefined') return new THREE.Texture()
  if (textureCache.has(url)) {
    return textureCache.get(url)!
  }

  const loader = new THREE.TextureLoader()
  const tex = loader.load(url, () => {
    tex.needsUpdate = true
  })
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = true
  if (url.includes('ring')) {
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.RepeatWrapping
  }
  textureCache.set(url, tex)
  return tex
}