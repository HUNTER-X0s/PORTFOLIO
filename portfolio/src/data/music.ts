export interface MusicTrack {
  id: string
  title: string
  mood: string
  icon: string
  src: string
}

export const musicPlaylist: MusicTrack[] = [
  {
    id: 'cyber-zen',
    title: 'Cyber Zen Ambient',
    mood: 'Atmospheric & Deep Focus',
    icon: '🌌',
    src: '/music/ambient.mp3',
  },
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
