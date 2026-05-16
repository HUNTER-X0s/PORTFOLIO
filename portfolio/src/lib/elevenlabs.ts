// ============================================================
// lib/elevenlabs.ts
// Optional premium TTS via ElevenLabs API
// Set NEXT_PUBLIC_ELEVENLABS_API_KEY + NEXT_PUBLIC_ELEVENLABS_VOICE_ID to activate
// Falls back to Web Speech API if not configured
// ============================================================

const API_KEY  = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY  || ''
const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB' // Adam voice

export const ELEVENLABS_ENABLED = !!API_KEY

// ── Speak text via ElevenLabs ──────────────────────────────────
export async function speakWithElevenLabs(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: string) => void
): Promise<void> {
  if (!API_KEY) {
    onError?.('ElevenLabs API key not configured')
    return
  }

  // Strip markdown for clean audio
  const clean = text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim()
    .slice(0, 800) // ElevenLabs free tier limit

  try {
    onStart?.()

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: clean,
          model_id: 'eleven_turbo_v2',   // fastest model
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const audioCtx = new AudioContext()
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

    const source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioCtx.destination)

    source.onended = () => { onEnd?.(); audioCtx.close() }
    source.start(0)

  } catch (error: any) {
    console.warn('ElevenLabs TTS failed, falling back to Web Speech API:', error.message)
    onError?.(error.message)
  }
}

// ── Available ElevenLabs voices ─────────────────────────────────
export const ELEVENLABS_VOICES = [
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam',    description: 'Deep, professional (recommended)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni',   description: 'Warm, friendly' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold',   description: 'Crisp, authoritative' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam',      description: 'Energetic, clear' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi',     description: 'Strong, confident' },
]
