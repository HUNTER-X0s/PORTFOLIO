'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Hash, ExternalLink, Github, Linkedin, Twitter, Instagram, Code2, X, Music, Volume2 } from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { navItems, projects, personalInfo } from '@/data/portfolio'
import { useCommandPalette, useSound } from '@/hooks'
import { cn } from '@/lib/utils'
import type { CommandItem } from '@/types'

export default function CommandPalette() {
  const { isOpen, setOpen } = useCommandPalette()
  const { playClick } = useSound()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const buildCommands = useCallback((): CommandItem[] => {
    const navigate = (href: string) => {
      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      setOpen(false)
    }

    const { musicEnabled, setMusicEnabled, soundEnabled, setSoundEnabled } = usePortfolioStore.getState()

    return [
      // Navigation
      ...navItems.map((item) => ({
        id: `nav-${item.id}`,
        label: item.label,
        description: `Go to ${item.label} section`,
        icon: 'hash',
        shortcut: undefined,
        action: () => { navigate(item.href); playClick() },
        category: 'navigation' as const,
      })),
      // Projects
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        label: p.title,
        description: p.tagline,
        icon: 'code',
        shortcut: undefined,
        action: () => {
          usePortfolioStore.getState().setActiveProjectId(p.id)
          navigate('#projects')
          playClick()
        },
        category: 'project' as const,
      })),
      // Social
      ...personalInfo.social.map((s) => ({
        id: `social-${s.platform}`,
        label: `${s.platform} — ${s.handle}`,
        description: `Open ${s.platform} profile`,
        icon: s.icon,
        shortcut: undefined,
        action: () => { window.open(s.url, '_blank'); playClick() },
        category: 'social' as const,
      })),
      // Actions
      {
        id: 'action-music-player',
        label: 'Open Sound Lounge (Music Player)',
        description: 'Browse all background songs, moods, and playlist',
        icon: 'music',
        shortcut: undefined,
        action: () => {
          usePortfolioStore.getState().setMusicPlayerOpen(true)
          playClick()
          setOpen(false)
        },
        category: 'action' as const,
      },
      {
        id: 'action-ambient',
        label: musicEnabled ? 'Pause Background Music' : 'Play Background Music',
        description: musicEnabled ? 'Pause soothing background soundtrack' : 'Play soothing background soundtrack',
        icon: 'music',
        shortcut: undefined,
        action: () => {
          setMusicEnabled(!musicEnabled)
          playClick()
          setOpen(false)
        },
        category: 'action' as const,
      },
      {
        id: 'action-next-track',
        label: 'Next Song / Track',
        description: 'Skip to next soothing song in playlist',
        icon: 'music',
        shortcut: undefined,
        action: () => {
          usePortfolioStore.getState().nextTrack()
          if (!musicEnabled) usePortfolioStore.getState().setMusicEnabled(true)
          playClick()
          setOpen(false)
        },
        category: 'action' as const,
      },
      {
        id: 'action-sfx',
        label: soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects',
        description: soundEnabled ? 'Disable interactive click sound effects' : 'Enable interactive click sound effects',
        icon: 'volume',
        shortcut: undefined,
        action: () => {
          setSoundEnabled(!soundEnabled)
          playClick()
          setOpen(false)
        },
        category: 'action' as const,
      },
      {
        id: 'action-resume',
        label: 'Download Resume',
        description: 'Get PDF resume',
        icon: 'external',
        shortcut: undefined,
        action: () => { window.open(personalInfo.resumeUrl, '_blank'); playClick() },
        category: 'action' as const,
      },
      {
        id: 'action-contact',
        label: 'Get in Touch',
        description: 'Open contact section',
        icon: 'hash',
        shortcut: undefined,
        action: () => { navigate('#contact'); playClick() },
        category: 'action' as const,
      },
    ]
  }, [playClick, setOpen])

  const allCommands = buildCommands()

  const filtered = query.trim()
    ? allCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands

  const grouped = {
    navigation: filtered.filter((c) => c.category === 'navigation'),
    project: filtered.filter((c) => c.category === 'project'),
    social: filtered.filter((c) => c.category === 'social'),
    action: filtered.filter((c) => c.category === 'action'),
  }

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        filtered[activeIndex]?.action()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, activeIndex])

function ThreadsIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 192 192"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.745C77.0123 44.745 61.4284 55.4858 54.3414 74.2435C48.0697 90.8415 50.4908 111.458 60.7725 125.753C70.1837 138.835 84.767 146.255 101.895 146.255C120.301 146.255 135.035 137.669 141.564 122.842C144.385 116.438 145.827 109.112 145.856 101.077H126.791C126.657 121.217 114.739 129.213 101.328 129.213C85.5771 129.213 71.3653 118.847 68.3297 95.8451C73.3444 98.4116 79.2882 100.089 86.0617 100.49C96.7997 101.127 107.563 98.0566 114.869 92.2773C122.88 85.9388 127.353 76.5186 127.445 65.7383C127.561 52.0723 118.665 44.745 97.222 44.745C80.3644 44.745 68.0494 54.4092 63.4862 70.9785C59.7126 84.6781 60.5283 102.735 69.1767 114.761C76.2483 124.596 87.4114 130.222 100.672 130.222C115.756 130.222 125.438 121.849 125.759 107.135C125.793 105.589 125.793 104.043 125.759 102.497L141.537 88.9883ZM108.643 78.4316C104.757 81.5088 98.6656 83.1816 91.4365 82.7539C84.3496 82.334 78.415 80.0879 73.7431 76.082C76.8407 68.3496 83.9579 61.7871 97.222 61.7871C107.96 61.7871 110.871 66.8633 110.803 72.8223C110.745 74.9629 109.967 76.9941 108.643 78.4316Z" />
    </svg>
  )
}

  const getIcon = (icon: string) => {
    const cls = 'w-4 h-4'
    switch (icon) {
      case 'github': return <Github className={cls} />
      case 'linkedin': return <Linkedin className={cls} />
      case 'twitter': return <Twitter className={cls} />
      case 'instagram': return <Instagram className={cls} />
      case 'threads': return <ThreadsIcon size={16} className={cls} />
      case 'code': return <Code2 className={cls} />
      case 'external': return <ExternalLink className={cls} />
      case 'music': return <Music className={cls} />
      case 'volume': return <Volume2 className={cls} />
      default: return <Hash className={cls} />
    }
  }

  const groupLabels: Record<string, string> = {
    navigation: 'Navigate',
    project: 'Projects',
    social: 'Social',
    action: 'Actions',
  }

  let itemIndex = 0
  const renderGroup = (key: string, items: CommandItem[]) => {
    if (!items.length) return null
    return (
      <div key={key} className="mb-3">
        <p className="px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-text-secondary">
          {groupLabels[key]}
        </p>
        {items.map((cmd) => {
          const idx = itemIndex++
          return (
            <motion.button
              key={cmd.id}
              onClick={cmd.action}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left',
                activeIndex === idx
                  ? 'bg-cyan/10 border border-cyan/20 text-text-primary'
                  : 'border border-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              )}
              whileTap={{ scale: 0.99 }}
            >
              <div className={cn(
                'flex-shrink-0 p-1.5 rounded-lg',
                activeIndex === idx ? 'bg-cyan/15 text-cyan' : 'bg-white/[0.04] text-text-secondary'
              )}>
                {getIcon(cmd.icon || 'hash')}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{cmd.label}</div>
                {cmd.description && (
                  <div className="text-xs text-text-secondary truncate">{cmd.description}</div>
                )}
              </div>
              {activeIndex === idx && (
                <ArrowRight size={14} className="ml-auto text-cyan flex-shrink-0" />
              )}
            </motion.button>
          )
        })}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <div className="fixed inset-0 z-[201] flex items-start justify-center pt-[5vh] sm:pt-[15vh] px-3 sm:px-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -20 }}
                transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="w-full max-w-xl glass-dropdown rounded-2xl overflow-hidden pointer-events-auto max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
                <Search size={18} className="text-text-secondary flex-shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
                  placeholder="Search anything..."
                  className="flex-1 bg-transparent text-text-primary placeholder-text-secondary outline-none text-sm font-body"
                />
                <button
                  onClick={() => { setOpen(false); playClick() }}
                  className="flex items-center justify-center p-1.5 rounded-lg border border-white/[0.08] hover:border-white/[0.18] bg-white/[0.05] hover:bg-white/[0.1] text-text-secondary hover:text-text-primary active:scale-[0.95] transition-all"
                  title="Close (ESC)"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 min-h-0">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-text-secondary text-sm">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  <>
                    {renderGroup('navigation', grouped.navigation)}
                    {renderGroup('project', grouped.project)}
                    {renderGroup('action', grouped.action)}
                    {renderGroup('social', grouped.social)}
                  </>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2.5 border-t border-white/[0.05] flex items-center justify-between">
                <div className="hidden sm:flex items-center gap-4 text-xs text-text-secondary font-mono">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="text-xs text-text-secondary font-mono ml-auto sm:ml-0">
                  {filtered.length} results
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
