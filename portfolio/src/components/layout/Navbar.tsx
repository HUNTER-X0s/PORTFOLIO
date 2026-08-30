'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Command, Volume2, VolumeX, Music } from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { roles, navItems, personalInfo } from '@/data/portfolio'
import { useSound } from '@/hooks'
import { cn } from '@/lib/utils'
import MusicPlayerPopover from './MusicPlayerPopover'

export default function Navbar() {
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const setActiveRole = usePortfolioStore((s) => s.setActiveRole)
  const activeSection = usePortfolioStore((s) => s.activeSection)
  const setCommandPaletteOpen = usePortfolioStore((s) => s.setCommandPaletteOpen)
  const soundEnabled = usePortfolioStore((s) => s.soundEnabled)
  const setSoundEnabled = usePortfolioStore((s) => s.setSoundEnabled)
  const musicEnabled = usePortfolioStore((s) => s.musicEnabled)
  const setMusicEnabled = usePortfolioStore((s) => s.setMusicEnabled)
  const isMusicPlayerOpen = usePortfolioStore((s) => s.isMusicPlayerOpen)
  const setMusicPlayerOpen = usePortfolioStore((s) => s.setMusicPlayerOpen)

  const { playClick } = useSound()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentRole = roles.find((r) => r.id === activeRole) || roles[0]

  useEffect(() => {
    let rafId = 0
    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50)
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isRoleDropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isRoleDropdownOpen])

  const handleNavClick = (href: string) => {
    playClick()
    const id = href.replace('#', '')

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 250)
    } else {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <>
      <motion.header
      className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-landscape',
          isScrolled ? 'py-1.5 sm:py-2.5' : 'py-2 sm:py-5'
        )}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div
          className={cn(
            'mx-auto max-w-[1280px] transition-all duration-300',
            isScrolled 
              ? 'glass rounded-2xl border border-white/[0.07] shadow-glass px-4 w-[calc(100%-2rem)]'
              : 'px-6 w-full'
          )}
        >
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Logo */}
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#hero')
              }}
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet relative flex items-center justify-center overflow-hidden">
                <span className="font-display font-bold text-sm text-white z-10">
                  {personalInfo.firstName[0]}
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-violet opacity-80 animate-rotate-slow" />
              </div>
              <span className="font-display font-semibold text-text-primary hidden sm:block">
                {personalInfo.firstName}
                <span className="text-cyan">.</span>
              </span>
            </motion.a>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.href)
                    playClick()
                  }}
                  className={cn(
                    'px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 whitespace-nowrap',
                    activeSection === item.id
                      ? 'text-cyan bg-cyan/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5">
              {/* Background Music Player Toggle & Anchored Sound Lounge Popover */}
              <div className="relative">
                <button
                  data-music-toggle
                  onClick={() => {
                    setMusicPlayerOpen(!isMusicPlayerOpen)
                    playClick()
                  }}
                  className={cn(
                    'p-2 rounded-xl transition-all flex items-center justify-center border relative',
                    musicEnabled || isMusicPlayerOpen
                      ? 'border-cyan/45 bg-cyan/15 text-cyan shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                      : 'border-white/[0.08] text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                  )}
                  title={musicEnabled ? 'Music Playing (Click for Sound Lounge)' : 'Music (Click for Sound Lounge)'}
                >
                  <Music size={15} className={cn(musicEnabled && 'animate-pulse text-cyan')} />
                  {musicEnabled && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan animate-ping" />
                  )}
                </button>
              </div>

              {/* Sound Effects Toggle (Click SFX) */}
              <button
                onClick={() => { setSoundEnabled(!soundEnabled); playClick() }}
                className={cn(
                  'p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all flex items-center justify-center border',
                  soundEnabled ? 'border-white/[0.08] text-cyan' : 'border-white/[0.04] text-text-secondary/40'
                )}
                title={soundEnabled ? 'Click Sound Effects: ON (Click to mute)' : 'Click Sound Effects: OFF (Click to enable)'}
              >
                {soundEnabled ? <Volume2 size={15} className="text-cyan" /> : <VolumeX size={15} />}
              </button>

              {/* Command palette shortcut */}
              <button
                onClick={() => { setCommandPaletteOpen(true); playClick() }}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary border border-white/[0.06] hover:border-cyan/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
              >
                <Command size={11} />
                <span>⌘K</span>
              </button>

              <div className="relative" ref={dropdownRef}>

                <button
                  onClick={() => {
                    setIsRoleDropdownOpen((prev) => !prev);
                    playClick();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-cyan/20 hover:border-cyan/40 active:scale-[0.97] transition-all text-sm"
                  title="View as role"
                >
                  <span>{currentRole.icon}</span>
                  <span className="text-text-primary font-medium hidden sm:block max-w-28 truncate">
                    {currentRole.shortLabel}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      'text-text-secondary transition-transform duration-200',
                      isRoleDropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isRoleDropdownOpen && (
                    <>
                      {/* Mobile/Tablet ambient backdrop to maintain identical PC glass visual clarity */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[290] bg-black/50 backdrop-blur-[3px] xl:hidden"
                        onClick={() => setIsRoleDropdownOpen(false)}
                      />

                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.19, 1, 0.22, 1] }}
                        className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] glass-dropdown rounded-2xl overflow-hidden max-h-[calc(100vh-5.5rem)] overflow-y-auto custom-scrollbar"
                        style={{ zIndex: 300 }}
                      >
                        <div className="p-2">
                          <p className="px-3 py-2 text-xs font-mono text-text-secondary uppercase tracking-widest">
                            View As
                          </p>
                          <div className="space-y-0.5">
                            {roles.map((role) => (
                              <button
                                key={role.id}
                                onClick={() => {
                                  setActiveRole(role.id)
                                  setIsRoleDropdownOpen(false)
                                  playClick()
                                }}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:translate-x-0.5',
                                  activeRole === role.id
                                    ? 'bg-cyan/15 border border-cyan/30 text-text-primary shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                                )}
                              >
                                <span className="text-base">{role.icon}</span>
                                <div className="text-left">
                                  <div className="font-medium text-sm">{role.label}</div>
                                  <div className="text-xs text-text-secondary">{role.description}</div>
                                </div>
                                {activeRole === role.id && (
                                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00E5FF]" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden mx-3 sm:mx-4 mt-2 glass-dropdown rounded-2xl overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar"
            >
              <div className="p-3 sm:p-4 space-y-0.5">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(item.href)
                    }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      activeSection === item.id
                        ? 'text-cyan bg-cyan/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                    )}
                  >
                    {item.label}
                  </motion.a>
                ))}

                {/* Mobile controls */}
                <div className="pt-3 mt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 px-2">
                  <button
                    data-music-toggle
                    onClick={() => {
                      setMusicPlayerOpen(!isMusicPlayerOpen)
                      playClick()
                    }}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium transition-all py-1.5 px-2.5 rounded-lg border',
                      musicEnabled || isMusicPlayerOpen
                        ? 'bg-cyan/15 border-cyan/30 text-cyan'
                        : 'border-white/[0.08] text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Music size={13} className={musicEnabled ? 'animate-pulse text-cyan' : ''} />
                    <span>{musicEnabled ? 'Music Lounge' : 'Sound Lounge'}</span>
                  </button>

                  <button
                    onClick={() => { setSoundEnabled(!soundEnabled); playClick() }}
                    className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-all py-1.5 px-2"
                  >
                    {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    <span>{soundEnabled ? 'SFX: On' : 'SFX: Off'}</span>
                  </button>

                  <button
                    onClick={() => { setCommandPaletteOpen(true); playClick(); setIsMobileMenuOpen(false) }}
                    className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-all py-1.5 px-2 ml-auto"
                  >
                    <Command size={12} />
                    <span>⌘K</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Global Sound Lounge Popover */}
      <MusicPlayerPopover />
    </>
  )
}
