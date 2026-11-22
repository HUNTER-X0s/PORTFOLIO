export interface MusicTrack {
  id: string
  title: string
  mood: string
  icon: string
  src: string
  isCustom?: boolean
}

export const musicPlaylist: MusicTrack[] = [
  {
    id: 'serene-sunset',
    title: 'Serene Sunset',
    mood: 'Calm & Warm Beats',
    icon: '🌅',
    src: '/music/ReelAudio-16624.mp3',
  },
  {
    id: 'dreamscape-echoes',
    title: 'Dreamscape Echoes',
    mood: 'Ethereal & Peaceful',
    icon: '✨',
    src: '/music/ReelAudio-95867.mp3',
  },
  {
    id: 'midnight-breeze',
    title: 'Midnight Breeze',
    mood: 'Mellow Night Vibe',
    icon: '🌙',
    src: '/music/ReelAudio-9536.mp3',
  },
  {
    id: 'deep-horizon',
    title: 'Deep Horizon',
    mood: 'Smooth & Soothing',
    icon: '🌊',
    src: '/music/ReelAudio-43214.mp3',
  },
  {
    id: 'ethereal-harmony',
    title: 'Ethereal Harmony',
    mood: 'Gentle & Uplifting',
    icon: '🕊️',
    src: '/music/ReelAudio-25370.mp3',
  },
  {
    id: 'quiet-reflections',
    title: 'Quiet Reflections',
    mood: 'Soft Acoustic Chill',
    icon: '🍃',
    src: '/music/ReelAudio-5184.mp3',
  },
  {
    id: 'golden-aura',
    title: 'Golden Aura',
    mood: 'Warm & Tranquil',
    icon: '☕',
    src: '/music/ReelAudio-17838.mp3',
  },
  {
    id: 'lucid-flow',
    title: 'Lucid Flow',
    mood: 'Ambient Melody',
    icon: '🪐',
    src: '/music/ReelAudio-3368.mp3',
  },
]

export const VIBE_ICONS = [
  { icon: '🐍', label: 'Python / Code' },
  { icon: '☕', label: 'Coffee / Aura' },
  { icon: '🌊', label: 'Ocean / Deep' },
  { icon: '🕊️', label: 'Bird / Harmony' },
  { icon: '🍃', label: 'Leaf / Chill' },
  { icon: '🌙', label: 'Night / Moon' },
  { icon: '🌅', label: 'Sunset / Warm' },
  { icon: '✨', label: 'Stars / Dream' },
  { icon: '🪐', label: 'Cosmic / Space' },
  { icon: '🌧️', label: 'Rain / Drops' },
  { icon: '🔥', label: 'Fire / Energy' },
  { icon: '🎸', label: 'Guitar / Rock' },
  { icon: '🎹', label: 'Piano / Keys' },
  { icon: '💻', label: 'Tech / Cyber' },
  { icon: '💖', label: 'Heart / Love' },
  { icon: '📼', label: 'Lo-Fi / Tape' },
]

export function detectMusicMetadata(title: string, fallbackText?: string): { icon: string; mood: string } {
  const text = `${title || ''} ${fallbackText || ''}`.toLowerCase()

  // 1. Python, Coding, Tech & AI
  if (text.includes('python') || text.includes('py_') || text.includes('.py')) {
    return { icon: '🐍', mood: 'Pythonic Grooves' }
  }
  if (text.includes('code') || text.includes('dev') || text.includes('hack') || text.includes('tech') || text.includes('terminal') || text.includes('program') || text.includes('script')) {
    return { icon: '💻', mood: 'Cyber Coding Flow' }
  }
  if (text.includes('ai') || text.includes('robot') || text.includes('bot') || text.includes('matrix') || text.includes('algo') || text.includes('cyber')) {
    return { icon: '🤖', mood: 'Synthesized AI Waves' }
  }

  // 2. Nature & Ambient Elements (coffee, ocean, bird, leaf, sunset, etc.)
  if (text.includes('coffee') || text.includes('cafe') || text.includes('tea') || text.includes('latte') || text.includes('aura') || text.includes('morning') || text.includes('warm') || text.includes('golden')) {
    return { icon: '☕', mood: 'Warm & Tranquil' }
  }
  if (text.includes('ocean') || text.includes('sea') || text.includes('wave') || text.includes('deep') || text.includes('horizon') || text.includes('water') || text.includes('beach') || text.includes('tide')) {
    return { icon: '🌊', mood: 'Smooth Ocean Drift' }
  }
  if (text.includes('rain') || text.includes('storm') || text.includes('thunder') || text.includes('drizzle') || text.includes('shower') || text.includes('drop')) {
    return { icon: '🌧️', mood: 'Peaceful Rainfall' }
  }
  if (text.includes('bird') || text.includes('harmony') || text.includes('peace') || text.includes('ethereal') || text.includes('dove') || text.includes('flight') || text.includes('wing')) {
    return { icon: '🕊️', mood: 'Gentle & Uplifting' }
  }
  if (text.includes('leaf') || text.includes('nature') || text.includes('forest') || text.includes('zen') || text.includes('tree') || text.includes('green') || text.includes('garden') || text.includes('quiet') || text.includes('reflection')) {
    return { icon: '🍃', mood: 'Soft Acoustic Chill' }
  }
  if (text.includes('sunset') || text.includes('sunrise') || text.includes('sun') || text.includes('dawn') || text.includes('dusk') || text.includes('serene') || text.includes('summer')) {
    return { icon: '🌅', mood: 'Calm & Warm Beats' }
  }
  if (text.includes('night') || text.includes('midnight') || text.includes('moon') || text.includes('dark') || text.includes('lunar') || text.includes('sleep') || text.includes('nocturnal')) {
    return { icon: '🌙', mood: 'Mellow Night Vibe' }
  }
  if (text.includes('space') || text.includes('cosmic') || text.includes('galaxy') || text.includes('astral') || text.includes('planet') || text.includes('orbit') || text.includes('saturn') || text.includes('universe') || text.includes('lucid')) {
    return { icon: '🪐', mood: 'Cosmic Floating Vibe' }
  }
  if (text.includes('fire') || text.includes('flame') || text.includes('energy') || text.includes('heat') || text.includes('burn') || text.includes('ignite') || text.includes('spark')) {
    return { icon: '🔥', mood: 'Vibrant Energy' }
  }
  if (text.includes('dream') || text.includes('magic') || text.includes('echo') || text.includes('star') || text.includes('sparkle') || text.includes('wonder')) {
    return { icon: '✨', mood: 'Dreamy & Atmospheric' }
  }
  if (text.includes('wind') || text.includes('breeze') || text.includes('air') || text.includes('cloud') || text.includes('sky')) {
    return { icon: '☁️', mood: 'Airy & Relaxed' }
  }

  // 3. Instruments & Genres
  if (text.includes('guitar') || text.includes('rock') || text.includes('acoustic') || text.includes('riff') || text.includes('string')) {
    return { icon: '🎸', mood: 'Acoustic Harmonics' }
  }
  if (text.includes('piano') || text.includes('keys') || text.includes('classic') || text.includes('jazz') || text.includes('chord')) {
    return { icon: '🎹', mood: 'Melodic Piano Chill' }
  }
  if (text.includes('lofi') || text.includes('lo-fi') || text.includes('chillhop') || text.includes('tape') || text.includes('vinyl') || text.includes('beat')) {
    return { icon: '📼', mood: 'Lo-Fi Chill Beats' }
  }
  if (text.includes('bass') || text.includes('synth') || text.includes('electronic') || text.includes('techno') || text.includes('dance') || text.includes('club')) {
    return { icon: '🎛️', mood: 'Electronic Soundscape' }
  }
  if (text.includes('love') || text.includes('heart') || text.includes('soul') || text.includes('romantic') || text.includes('sweet')) {
    return { icon: '💖', mood: 'Heartfelt Melodies' }
  }
  if (text.includes('game') || text.includes('arcade') || text.includes('retro') || text.includes('8bit') || text.includes('quest')) {
    return { icon: '👾', mood: 'Arcade Ambience' }
  }

  // Fallback: pick a harmonious ambient icon based on the title string
  const fallbacks = [
    { icon: '✨', mood: 'Ambient Melodic Flow' },
    { icon: '🪐', mood: 'Atmospheric Soundscape' },
    { icon: '🎵', mood: 'Personal Soundtrack' },
    { icon: '🌌', mood: 'Celestial Harmony' },
    { icon: '🍃', mood: 'Mellow Instrumental' },
    { icon: '💫', mood: 'Gentle Soundscape' },
  ]
  let sum = 0
  for (let i = 0; i < text.length; i++) sum += text.charCodeAt(i)
  return fallbacks[Math.abs(sum) % fallbacks.length]
}
