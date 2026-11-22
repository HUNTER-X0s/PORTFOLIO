// src/components/space/planetData.ts
// Authentic astronomical data for the 8 major planets + Moon + Sun

export type TrajectoryType =
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'diagonal-down-right'
  | 'diagonal-down-left'
  | 'deep-flyby'

export interface PlanetDef {
  id: string
  name: string
  type: string
  texture: string
  cloudsTexture?: string
  ringTexture?: string
  radius: number
  rotationSpeed: number
  orbitSpeed: number
  trajectory: TrajectoryType
  baseX?: number
  baseY?: number
  baseZ: number
  yAmplitude?: number
  timeOffset: number
  atmosphereColor: string
  atmosphereIntensity: number
  axialTilt: number // in radians
  distance: string
  fact: string
  diameter: string
  hasMoon?: boolean
  moonTexture?: string
}

export const REAL_PLANETS: PlanetDef[] = [
  // 1. Mercury - Rocky cratered swift planet
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Terrestrial Planet',
    texture: '/textures/planets/mercury.jpg',
    radius: 0.38,
    rotationSpeed: 0.08,
    orbitSpeed: 0.015,
    trajectory: 'diagonal-down-right',
    baseY: 2.5,
    baseZ: -12,
    yAmplitude: 2.2,
    timeOffset: 0.1,
    atmosphereColor: '#C4B59D',
    atmosphereIntensity: 0.12,
    axialTilt: 0.03,
    distance: '57.9M km',
    fact: 'Smallest planet in the solar system, with temperature swings of over 600°C between day and night.',
    diameter: '4,879 km',
  },

  // 2. Venus - Golden shrouded greenhouse world
  {
    id: 'venus',
    name: 'Venus',
    type: 'Terrestrial Planet',
    texture: '/textures/planets/venus.jpg',
    radius: 0.52,
    rotationSpeed: -0.06, // retrograde spin
    orbitSpeed: 0.012,
    trajectory: 'top-to-bottom',
    baseX: -8.5,
    baseZ: -13,
    timeOffset: 0.45,
    atmosphereColor: '#E6B875',
    atmosphereIntensity: 0.32,
    axialTilt: 3.1,
    distance: '108.2M km',
    fact: 'Hottest planet in our solar system, with toxic clouds of sulfuric acid and runaway greenhouse heat.',
    diameter: '12,104 km',
  },

  // 3. Earth - Blue marble with clouds and Moon
  {
    id: 'earth',
    name: 'Earth',
    type: 'Terrestrial Planet',
    texture: '/textures/planets/earth_day.jpg',
    cloudsTexture: '/textures/planets/earth_clouds.jpg',
    radius: 0.56,
    rotationSpeed: 0.14,
    orbitSpeed: 0.011,
    trajectory: 'left-to-right',
    baseY: 1.6,
    baseZ: -9.5,
    yAmplitude: 2.0,
    timeOffset: 0.22,
    atmosphereColor: '#00E5FF',
    atmosphereIntensity: 0.45,
    axialTilt: 0.41, // 23.5°
    distance: '149.6M km',
    fact: 'The cradle of humanity, harboring vast oceans of liquid water and a rich, protective magnetosphere.',
    diameter: '12,742 km',
    hasMoon: true,
    moonTexture: '/textures/planets/moon.jpg',
  },

  // 4. Mars - The Red Planet
  {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet',
    texture: '/textures/planets/mars.jpg',
    radius: 0.44,
    rotationSpeed: 0.13,
    orbitSpeed: 0.013,
    trajectory: 'diagonal-down-left',
    baseY: 1.2,
    baseZ: -11,
    yAmplitude: 1.8,
    timeOffset: 0.72,
    atmosphereColor: '#FF6B4A',
    atmosphereIntensity: 0.25,
    axialTilt: 0.44,
    distance: '227.9M km',
    fact: 'The Red Planet, home to Olympus Mons - the largest volcano and shield system in the entire solar system.',
    diameter: '6,779 km',
  },

  // 5. Jupiter - King of the Solar System
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant',
    texture: '/textures/planets/jupiter.jpg',
    radius: 0.88,
    rotationSpeed: 0.22, // fast rotation
    orbitSpeed: 0.009,
    trajectory: 'right-to-left',
    baseY: -2.8,
    baseZ: -14,
    yAmplitude: 1.9,
    timeOffset: 0.58,
    atmosphereColor: '#D39C7E',
    atmosphereIntensity: 0.35,
    axialTilt: 0.05,
    distance: '778.5M km',
    fact: 'Gas giant with a mass greater than all other planets combined, and a Great Red Spot storm raging for centuries.',
    diameter: '139,820 km',
  },

  // 6. Saturn - Majestic Ringed Planet
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant',
    texture: '/textures/planets/saturn.jpg',
    ringTexture: '/textures/planets/saturn_ring.png',
    radius: 0.74,
    rotationSpeed: 0.18,
    orbitSpeed: 0.008,
    trajectory: 'left-to-right',
    baseY: -0.6,
    baseZ: -13.5,
    yAmplitude: 1.6,
    timeOffset: 0.88,
    atmosphereColor: '#E2BF7D',
    atmosphereIntensity: 0.30,
    axialTilt: 0.47, // 27°
    distance: '1.43B km',
    fact: 'Crowned with breathtaking rings of ice and cosmic dust spanning over 282,000 kilometers.',
    diameter: '116,460 km',
  },

  // 7. Uranus - The Tilted Ice Giant
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    texture: '/textures/planets/uranus.jpg',
    radius: 0.58,
    rotationSpeed: -0.12,
    orbitSpeed: 0.007,
    trajectory: 'bottom-to-top',
    baseX: 8.0,
    baseZ: -13,
    timeOffset: 0.35,
    atmosphereColor: '#5CE1E6',
    atmosphereIntensity: 0.38,
    axialTilt: 1.71, // 98° tilt on its side
    distance: '2.87B km',
    fact: 'An icy giant rotating on its side at an extreme 98° tilt, enveloped in supersonic diamond rains.',
    diameter: '50,724 km',
  },

  // 8. Neptune - Sapphire Storm Giant
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant',
    texture: '/textures/planets/neptune.jpg',
    radius: 0.56,
    rotationSpeed: 0.14,
    orbitSpeed: 0.006,
    trajectory: 'deep-flyby',
    baseY: -1.2,
    baseZ: -16,
    timeOffset: 0.02,
    atmosphereColor: '#2D68C4',
    atmosphereIntensity: 0.42,
    axialTilt: 0.50,
    distance: '4.50B km',
    fact: 'Distant sapphire ice giant with supersonic winds reaching speeds of over 2,100 km/h.',
    diameter: '49,244 km',
  },
]