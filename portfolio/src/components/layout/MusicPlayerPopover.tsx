'use client'

import { useState, useEffect, useRef } from 'react'
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
  Plus,
  Upload,
  Link as LinkIcon,
  Trash2,
  Check,
} from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { musicPlaylist, detectMusicMetadata } from '@/data/music'
import { useSound } from '@/hooks'
import { cn } from '@/lib/utils'
import SoundLoungeVortexUI from './SoundLoungeVortexUI'

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
    customTracks,
    addCustomTrack,
    removeCustomTrack,
  } = usePortfolioStore()

  const { playClick } = useSound()
  const popoverRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local state for Add Music feature
  const [showAddMusic, setShowAddMusic] = useState(false)
  const [addMode, setAddMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState('')
  const [titleInput, setTitleInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isUploadClicked, setIsUploadClicked] = useState(false)
  const allTracks = [...customTracks, ...musicPlaylist]
  const currentTrack = allTracks[currentTrackIndex] || allTracks[0]

  // Helper to ensure contextual icon & mood for custom tracks
  const getTrackDisplay = (track?: { title: string; mood: string; icon: string; isCustom?: boolean }) => {
    if (!track) return { icon: '🎵', mood: 'Soundtrack' }
    if (!track.isCustom) return { icon: track.icon, mood: track.mood }
    const isLegacyIcon = !track.icon || track.icon === '🎧' || track.icon === '🎵'
    const isLegacyMood =
      !track.mood ||
      track.mood === 'Custom Audio Stream' ||
      track.mood === 'Personal Audio File'
    const meta = detectMusicMetadata(track.title)
    return {
      icon: isLegacyIcon ? meta.icon : track.icon,
      mood: isLegacyMood ? meta.mood : track.mood,
    }
  }

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
        setShowAddMusic(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMusicPlayerOpen(false)
        setShowAddMusic(false)
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

  // Handle local audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    playClick()
    const rawName = file.name.replace(/\.[^/.]+$/, '').trim()
    const cleanTitle = rawName.length > 28 ? rawName.slice(0, 25) + '...' : rawName || 'My Custom Track'
    const blobUrl = URL.createObjectURL(file)
    const meta = detectMusicMetadata(cleanTitle, file.name)

    const newTrack = {
      id: `custom-${Date.now()}`,
      title: cleanTitle,
      mood: meta.mood,
      icon: meta.icon,
      src: blobUrl,
      isCustom: true,
    }

    addCustomTrack(newTrack)
    setFeedback(`"${cleanTitle}" added & playing!`)
    setTimeout(() => setFeedback(null), 3500)

    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowAddMusic(false)
  }

  // Handle direct audio URL submission
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanUrl = urlInput.trim()
    if (!cleanUrl) return

    playClick()
    let derivedTitle = titleInput.trim()
    if (!derivedTitle) {
      try {
        const u = new URL(cleanUrl)
        const pathname = u.pathname.split('/').pop() || 'Web Audio Stream'
        derivedTitle = pathname.replace(/\.[^/.]+$/, '') || 'Web Audio Stream'
      } catch {
        derivedTitle = 'Custom Web Audio'
      }
    }
    if (derivedTitle.length > 28) {
      derivedTitle = derivedTitle.slice(0, 25) + '...'
    }

    const meta = detectMusicMetadata(derivedTitle, cleanUrl)

    const newTrack = {
      id: `custom-${Date.now()}`,
      title: derivedTitle,
      mood: meta.mood,
      icon: meta.icon,
      src: cleanUrl,
      isCustom: true,
    }

    addCustomTrack(newTrack)
    setUrlInput('')
    setTitleInput('')
    setFeedback(`"${derivedTitle}" added & playing!`)
    setTimeout(() => setFeedback(null), 3500)
    setShowAddMusic(false)
  }

  const handleDeleteCustomTrack = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    playClick()
    removeCustomTrack(id)
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
            onClick={() => {
              setMusicPlayerOpen(false)
              setShowAddMusic(false)
            }}
          />

          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-16 sm:top-20 inset-x-0 mx-auto z-[300] w-[calc(100vw-2rem)] max-w-[360px] sm:w-[370px] glass-dropdown rounded-2xl overflow-hidden max-h-[calc(100vh-5.5rem)] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
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

            <div className="flex items-center justify-between px-4 py-2.5 sm:py-3 border-b border-white/[0.08] relative z-10 min-h-[50px]">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center flex-shrink-0">
                  <SoundLoungeVortexUI isHovered={true} isActive={true} isPlaying={musicEnabled} />
                  <Music size={13} className="relative z-10 text-cyan drop-shadow-[0_0_5px_#00E5FF]" />
                </div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text-primary">
                  Sound Lounge
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/30 font-mono transition-all">
                  {allTracks.length} Tracks
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMusicPlayerOpen(false)
                    setShowAddMusic(false)
                    playClick()
                  }}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                  title="Close Player"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Feedback Banner */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-3 py-1.5 bg-neon-green/15 border-b border-neon-green/30 text-neon-green text-[11px] flex items-center gap-2 font-mono"
              >
                <Check size={13} className="flex-shrink-0" />
                <span className="truncate">{feedback}</span>
              </motion.div>
            )}



            {/* Now Playing Bar Card */}
            <div className="p-4 bg-white/[0.02] border-b border-white/[0.06] relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 border border-cyan/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,229,255,0.2)] flex-shrink-0 relative">
                  <span>{getTrackDisplay(currentTrack).icon}</span>
                  {musicEnabled && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan animate-ping" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary truncate leading-none">
                      {currentTrack?.title || 'No Track Selected'}
                    </h4>
                    {currentTrack?.isCustom && (
                      <span className="h-[16px] leading-none text-[8.5px] uppercase font-mono font-semibold tracking-wider px-1.5 rounded-full bg-gradient-to-r from-purple-500/25 to-fuchsia-500/25 text-purple-200 border border-purple-400/50 shadow-[0_0_6px_rgba(168,85,247,0.25)] flex-shrink-0 inline-flex items-center justify-center">
                        Custom
                      </span>
                    )}
                    {musicEnabled && <Sparkles size={12} className="text-cyan flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-0.5">{getTrackDisplay(currentTrack).mood}</p>
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
              <div className="flex items-center justify-between px-2.5 py-1">
                <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
                  Soundtracks ({allTracks.length})
                </span>
                <span className="text-[10px] font-mono text-text-secondary/60">
                  {customTracks.length > 0 && `${customTracks.length} Custom • `}{musicPlaylist.length} Built-in
                </span>
              </div>

              {allTracks.map((track, idx) => {
                const isCurrent = currentTrackIndex === idx
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={cn(
                      'group w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer',
                      isCurrent
                        ? 'bg-cyan/15 border border-cyan/35 text-text-primary shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                        : 'border border-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                    )}
                  >
                    <span className="text-base flex-shrink-0">{getTrackDisplay(track).icon}</span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={cn(
                            'text-xs font-medium truncate leading-none',
                            isCurrent && 'text-cyan font-semibold'
                          )}
                          title={track.title}
                        >
                          {track.title}
                        </span>
                        {track.isCustom && (
                          <span className="h-[15px] leading-none text-[8.5px] uppercase font-mono font-semibold tracking-wider px-1.5 rounded bg-purple-500/25 text-purple-200 border border-purple-400/50 shadow-[0_0_6px_rgba(168,85,247,0.2)] flex-shrink-0 inline-flex items-center justify-center">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-text-secondary truncate">{getTrackDisplay(track).mood}</div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Delete button for custom user tracks */}
                      {track.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomTrack(e, track.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-all"
                          title="Remove Custom Track"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}

                      {isCurrent && musicEnabled && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping flex-shrink-0" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Collapsible Add Custom Music Panel (above bottom footer) */}
            <AnimatePresence>
              {showAddMusic && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-white/[0.03] border-t border-white/[0.08] relative z-10"
                >
                  <div className="p-3 space-y-2.5">
                    {/* Mode Tabs */}
                    <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => {
                          playClick()
                          setAddMode('upload')
                        }}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] rounded-md font-mono transition-all',
                          addMode === 'upload'
                            ? 'bg-cyan/20 text-cyan border border-cyan/40 font-semibold'
                            : 'text-text-secondary hover:text-text-primary'
                        )}
                      >
                        <Upload size={12} />
                        <span>Upload File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          playClick()
                          setAddMode('url')
                        }}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] rounded-md font-mono transition-all',
                          addMode === 'url'
                            ? 'bg-cyan/20 text-cyan border border-cyan/40 font-semibold'
                            : 'text-text-secondary hover:text-text-primary'
                        )}
                      >
                        <LinkIcon size={12} />
                        <span>Web Audio URL</span>
                      </button>
                    </div>


                    {/* Mode 1: File Upload */}
                    {addMode === 'upload' && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border border-dashed border-cyan/40 hover:border-cyan/70 bg-cyan/5 hover:bg-cyan/10 p-3 rounded-xl text-center transition-all group"
                      >
                        <Upload size={20} className="mx-auto text-cyan mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-text-primary font-medium block">
                          Choose an audio file from your device
                        </span>
                        <span className="text-[10px] text-text-secondary block mt-0.5 font-mono">
                          Supports MP3, WAV, OGG, M4A, FLAC
                        </span>
                      </div>
                    )}

                    {/* Mode 2: Audio URL */}
                    {addMode === 'url' && (
                      <form onSubmit={handleUrlSubmit} className="space-y-1.5">
                        <input
                          type="url"
                          required
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="Paste direct audio URL (e.g. https://.../song.mp3)"
                          className="w-full text-xs px-2.5 py-2 rounded-lg bg-black/50 border border-white/10 focus:border-cyan/50 text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          placeholder="Track Title (Optional)"
                          className="w-full text-xs px-2.5 py-2 rounded-lg bg-black/50 border border-white/10 focus:border-cyan/50 text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="w-full py-1.5 rounded-lg bg-cyan hover:bg-cyan/90 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                        >
                          <Plus size={13} />
                          <span>Add & Play Track</span>
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer note & Add Custom Music button */}
            <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] text-text-secondary/60">
                Plays seamlessly while exploring
              </span>
              <button
                type="button"
                onClick={() => {
                  playClick()
                  setIsUploadClicked(true)
                  setTimeout(() => setIsUploadClicked(false), 260)
                  setShowAddMusic(!showAddMusic)
                }}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 select-none cursor-pointer no-underline active:scale-115',
                  showAddMusic
                    ? 'bg-cyan text-black font-semibold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'bg-cyan/15 hover:bg-cyan/25 text-cyan border border-cyan/35 hover:border-cyan/60 hover:shadow-[0_0_10px_rgba(0,229,255,0.2)]',
                  isUploadClicked && 'scale-115 font-bold shadow-[0_0_10px_rgba(0,229,255,0.7)]'
                )}
                style={{ textDecoration: 'none' }}
                title="Add Your Own Music"
              >
                <Plus
                  size={12}
                  className={cn(
                    'transition-transform duration-200',
                    showAddMusic && 'rotate-45'
                  )}
                />
                <span>{showAddMusic ? 'Close Drawer' : 'Add Custom Music'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
