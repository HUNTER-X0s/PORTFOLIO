'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Hash, ExternalLink, Github, Linkedin, Twitter, Code2 } from 'lucide-react'
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

  const getIcon = (icon: string) => {
    const cls = 'w-4 h-4'
    switch (icon) {
      case 'github': return <Github className={cls} />
      case 'linkedin': return <Linkedin className={cls} />
      case 'twitter': return <Twitter className={cls} />
      case 'code': return <Code2 className={cls} />
      case 'external': return <ExternalLink className={cls} />
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
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                activeIndex === idx
                  ? 'bg-cyan/10 border border-cyan/20 text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              )}
              whileTap={{ scale: 0.99 }}
            >
              <div className={cn(
                'flex-shrink-0 p-1.5 rounded-lg transition-colors',
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
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-[201] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -20 }}
              transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
              className="w-full max-w-xl glass-strong rounded-2xl border border-white/[0.1] shadow-glass-lg overflow-hidden"
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
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs text-text-secondary font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[420px] overflow-y-auto no-scrollbar p-2">
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
                <div className="flex items-center gap-4 text-xs text-text-secondary font-mono">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="text-xs text-text-secondary font-mono">
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
