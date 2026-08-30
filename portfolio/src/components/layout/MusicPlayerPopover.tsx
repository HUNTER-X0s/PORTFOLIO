'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Music,
  Disc3,
  Sparkles,
} from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { musicPlaylist } from '@/data/music'
import { useSound } from '@/hooks'
import { cn } from '@/lib/utils'

export default function MusicPlayerPopover() {
  const {
    isMusicPlayerOpen,
    setMusicPlayerOpen,
    musicEnabled,
    setMusicEnabled,
    currentTrackIndex,
    setCurrentTrackIndex,
    volume,
    setVolume,
    nextTrack,
    prevTrack,
  } = usePortfolioStore()

  const { playClick } = useSound()
  const popoverRef = useRef<HTMLDivElement>(null)
  const currentTrack = musicPlaylist[currentTrackIndex] || musicPlaylist[0]

  // Close on Escape or click outside
  useEffect(() => {
    if (!isMusicPlayerOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-music-toggle]')
      ) {
        setMusicPlayerOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMusicPlayerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMusicPlayerOpen, setMusicPlayerOpen])

  const handleTogglePlay = () => {
    playClick()
    if (!musicEnabled) {
      if (
        typeof window !== 'undefined' &&
        typeof (window as any).__startBackgroundMusic === 'function'
      ) {
        try {
          ;(window as any).__startBackgroundMusic(currentTrackIndex)
        } catch {}
      }
    }
    setMusicEnabled(!musicEnabled)
  }

  const handleSelectTrack = (index: number) => {
    playClick()
    setCurrentTrackIndex(index)
    if (!musicEnabled) {
      if (
        typeof window !== 'undefined' &&
        typeof (window as any).__startBackgroundMusic === 'function'
      ) {
        try {
          ;(window as any).__startBackgroundMusic(index)
        } catch {}
      }
      setMusicEnabled(true)
    }
  }

  return (
    <AnimatePresence>
      {isMusicPlayerOpen && (
        <>
          {/* Ambient backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[290] bg-black/50 backdrop-blur-[2px]"
            onClick={() => setMusicPlayerOpen(false)}
          />

          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-16 sm:top-20 inset-x-0 mx-auto z-[300] w-[calc(100vw-2rem)] max-w-[340px] sm:w-[350px] glass-dropdown rounded-2xl overflow-hidden max-h-[calc(100vh-5.5rem)] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            {/* Ambient Glows */}
            <div
              className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-cyan/15 blur-2xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-purple/15 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] relative z-10">
            <div className="flex items-center gap-2">
              <Disc3
                size={16}
                className={cn('text-cyan', musicEnabled && 'animate-spin')}
                style={{ animationDuration: '4s' }}
              />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text-primary">
                Sound Lounge
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/30 font-mono">
                {musicPlaylist.length} Tracks
              </span>
            </div>

            <button
              onClick={() => {
                setMusicPlayerOpen(false)
                playClick()
              }}
              className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
              title="Close Player"
            >
              <X size={14} />
            </button>
          </div>

          {/* Now Playing Bar Card */}
          <div className="p-4 bg-white/[0.02] border-b border-white/[0.06] relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 border border-cyan/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,229,255,0.2)] flex-shrink-0 relative">
                <span>{currentTrack.icon}</span>
                {musicEnabled && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan animate-ping" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-text-primary truncate">
                    {currentTrack.title}
                  </h4>
                  {musicEnabled && <Sparkles size={12} className="text-cyan flex-shrink-0" />}
                </div>
                <p className="text-xs text-text-secondary truncate mt-0.5">{currentTrack.mood}</p>
              </div>

              {/* Animated Equalizer */}
              {musicEnabled ? (
                <div className="flex items-end gap-[3px] h-4 w-4 flex-shrink-0">
                  <span
                    className="w-[2.5px] bg-cyan rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"
                    style={{ height: '70%' }}
                  />
                  <span
                    className="w-[2.5px] bg-cyan rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s]"
                    style={{ height: '100%' }}
                  />
                  <span
                    className="w-[2.5px] bg-cyan rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s]"
                    style={{ height: '50%' }}
                  />
                </div>
              ) : (
                <span className="text-[10px] font-mono text-text-secondary/60 uppercase">
                  Paused
                </span>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                {/* Prev */}
                <button
                  onClick={() => {
                    playClick()
                    prevTrack()
                  }}
                  className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] active:scale-95 transition-all"
                  title="Previous Song"
                >
                  <SkipBack size={15} />
                </button>

                {/* Play / Pause */}
                <button
                  onClick={handleTogglePlay}
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md',
                    musicEnabled
                      ? 'bg-cyan text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                      : 'bg-white/[0.08] hover:bg-cyan/20 text-text-primary border border-white/[0.1] hover:border-cyan/30'
                  )}
                  title={musicEnabled ? 'Pause Music' : 'Play Music'}
                >
                  {musicEnabled ? (
                    <Pause size={16} className="fill-current" />
                  ) : (
                    <Play size={16} className="fill-current ml-0.5" />
                  )}
                </button>

                {/* Next */}
                <button
                  onClick={() => {
                    playClick()
                    nextTrack()
                  }}
                  className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] active:scale-95 transition-all"
                  title="Next Song"
                >
                  <SkipForward size={15} />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 flex-1 max-w-[140px] pl-2 border-l border-white/[0.08]">
                <button
                  onClick={() => {
                    playClick()
                    setVolume(volume > 0 ? 0 : 0.4)
                  }}
                  className="text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
                  title={volume === 0 ? 'Unmute' : 'Mute'}
                >
                  {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} className="text-cyan" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-cyan focus:outline-none"
                  title={`Volume: ${Math.round(volume * 100)}%`}
                />
              </div>
            </div>
          </div>

          {/* Playlist Tracks List */}
          <div className="p-2 flex-1 min-h-0 max-h-48 sm:max-h-56 overflow-y-auto custom-scrollbar space-y-1 relative z-10">
            <p className="px-2.5 py-1 text-[10px] font-mono text-text-secondary uppercase tracking-widest">
              Select Soundtrack
            </p>

            {musicPlaylist.map((track, idx) => {
              const isCurrent = currentTrackIndex === idx
              return (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all',
                    isCurrent
                      ? 'bg-cyan/15 border border-cyan/35 text-text-primary shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                      : 'border border-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                  )}
                >
                  <span className="text-base flex-shrink-0">{track.icon}</span>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium truncate flex items-center gap-1.5">
                      <span className={cn(isCurrent && 'text-cyan font-semibold')}>
                        {track.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-secondary truncate">{track.mood}</div>
                  </div>

                  {isCurrent && musicEnabled && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-white/[0.02] border-t border-white/[0.06] text-center">
            <span className="text-[10px] text-text-secondary/60">
              Music continues playing while exploring the portfolio
            </span>
          </div>
        </motion.div>
      </>
      )}
    </AnimatePresence>
  )
}
