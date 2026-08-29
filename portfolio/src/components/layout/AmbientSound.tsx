'use client'

import { useEffect, useRef } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { musicPlaylist } from '@/data/music'

/**
 * AmbientSound — Multi-Track Audio Engine & Background Music Player
 * Handles high-fidelity MP3/WAV playback from the playlist, volume fading,
 * track transitions, looping, and Web Audio API synthesizer fallback.
 */
export default function AmbientSound() {
  const musicEnabled = usePortfolioStore((s) => s.musicEnabled)
  const currentTrackIndex = usePortfolioStore((s) => s.currentTrackIndex)
  const volume = usePortfolioStore((s) => s.volume)
  const nextTrack = usePortfolioStore((s) => s.nextTrack)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentTrackRef = useRef<number>(currentTrackIndex)
  const fadeIntervalRef = useRef<any>(null)

  // Keep track ref in sync
  useEffect(() => {
    currentTrackRef.current = currentTrackIndex
  }, [currentTrackIndex])

  // Initialize HTML5 audio element
  useEffect(() => {
    if (typeof window === 'undefined') return

    const audio = new Audio()
    audio.preload = 'none'
    audio.loop = false // We handle onEnded for playlist advancing or seamless loop
    audio.volume = volume
    audioRef.current = audio

    const handleEnded = () => {
      // Auto-advance to next song or loop
      nextTrack()
    }

    const handleError = (e: any) => {
      console.warn('Audio playback error, trying fallback track:', e)
      // If error occurs, advance or loop
      setTimeout(() => {
        nextTrack()
      }, 500)
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    // Global trigger for direct click gestures
    ;(window as any).__startBackgroundMusic = (trackIndex?: number) => {
      const idx = typeof trackIndex === 'number' ? trackIndex : currentTrackRef.current
      const track = musicPlaylist[idx] || musicPlaylist[0]
      if (track) {
        audio.src = track.src
        audio.volume = volume
        audio.play().catch(() => {})
      }
    }

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
      delete (window as any).__startBackgroundMusic
    }
  }, [nextTrack, volume])

  // React to volume changes dynamically
  useEffect(() => {
    if (audioRef.current && musicEnabled) {
      audioRef.current.volume = volume
    }
  }, [volume, musicEnabled])

  // React to track change or musicEnabled toggle
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)

    const track = musicPlaylist[currentTrackIndex] || musicPlaylist[0]

    if (musicEnabled && track) {
      // If source changed or audio paused, update source and play
      const targetSrc = window.location.origin + track.src
      if (audio.src !== targetSrc) {
        audio.src = track.src
        audio.load()
      }

      audio.play().then(() => {
        // Smooth volume fade-in up to desired volume
        let currentVol = 0
        audio.volume = 0
        fadeIntervalRef.current = setInterval(() => {
          currentVol = Math.min(volume, currentVol + 0.05)
          audio.volume = currentVol
          if (currentVol >= volume) clearInterval(fadeIntervalRef.current)
        }, 50)
      }).catch((err) => {
        console.warn('Audio play prevented or interrupted:', err)
      })
    } else {
      if (!audio.paused) {
        // Smooth fade out then pause
        let currentVol = audio.volume
        fadeIntervalRef.current = setInterval(() => {
          currentVol = Math.max(0, currentVol - 0.08)
          audio.volume = currentVol
          if (currentVol <= 0) {
            clearInterval(fadeIntervalRef.current)
            audio.pause()
          }
        }, 40)
      }
    }

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
    }
  }, [musicEnabled, currentTrackIndex, volume])

  return null
}
