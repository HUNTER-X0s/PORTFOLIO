'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Command, Volume2, VolumeX, Music } from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { roles, navItems, personalInfo } from '@/data/portfolio'
import { useSound } from '@/hooks'
import { cn } from '@/lib/utils'
import MusicPlayerPopover from './MusicPlayerPopover'
import BrandLogo from './BrandLogo'
import SoundLoungeVortexUI from './SoundLoungeVortexUI'

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
  const [isMusicBtnHovered, setIsMusicBtnHovered] = useState(false)
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
    const el = document.getElementById(id)

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }

    requestAnimationFrame(() => {
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  return (
    <>
      <motion.header
        className="fixed top-2.5 sm:top-3.5 inset-x-3 sm:inset-x-5 lg:inset-x-6 z-50 transition-all duration-300 navbar-landscape"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div
          className={cn(
            'w-full transition-all duration-300 rounded-2xl glass shadow-glass navbar-static',
            isScrolled
              ? 'border-cyan/30 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12),0_0_16px_rgba(0,229,255,0.1)]'
              : 'border-white/[0.07]'
          )}
        >
          <div className="w-full px-3.5 sm:px-6 flex items-center justify-between h-11 sm:h-12">
            {/* Logo */}
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#hero')
              }}
              className="flex items-center gap-2.5 group flex-shrink-0"
              whileHover={{ scale: 1.02 }}
            >
              <BrandLogo size={32} />
              <span className="font-display font-bold text-base sm:text-lg text-text-primary hidden sm:block tracking-wide leading-none group-hover:text-cyan transition-colors duration-200">
                {personalInfo.firstName}
                <span className="text-cyan">.</span>
              </span>
            </motion.a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                    'px-2.5 xl:px-3 py-1 rounded-lg text-[15px] xl:text-[16px] font-medium transition-all duration-200 whitespace-nowrap tracking-wide leading-tight',
                    activeSection === item.id
                      ? 'text-cyan bg-cyan/15 font-semibold shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.06]'
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Background Music Player Toggle & Anchored Sound Lounge Popover */}
              <div className="relative mx-1">
                <motion.button
                  data-music-toggle
                  onClick={() => {
                    setMusicPlayerOpen(!isMusicPlayerOpen)
                    playClick()
                  }}
                  onMouseEnter={() => setIsMusicBtnHovered(true)}
                  onMouseLeave={() => setIsMusicBtnHovered(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="relative w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer group bg-transparent border-0 outline-none p-0 focus:outline-none"
                  title={musicEnabled ? 'Sound Lounge — Music Playing (Click for playlist)' : 'Sound Lounge — Cosmic Ambient Beats (Click to play)'}
                >
                  {/* Cosmic Multicolored Acoustic Vortex Corona */}
                  <SoundLoungeVortexUI
                    isHovered={isMusicBtnHovered}
                    isActive={isMusicPlayerOpen}
                    isPlaying={musicEnabled}
                  />

                  {/* Central Dynamic Audio Core */}
                  <div className="relative z-10 flex items-center justify-center pointer-events-none">
                    <Music
                      size={15}
                      className={cn(
                        'transition-all duration-300 filter',
                        musicEnabled || isMusicBtnHovered || isMusicPlayerOpen
                          ? 'text-cyan drop-shadow-[0_0_6px_#00F5FF] drop-shadow-[0_0_12px_#FF2D9C] scale-105'
                          : 'text-text-primary drop-shadow-[0_0_4px_rgba(0,245,255,0.7)]'
                      )}
                    />
                  </div>

                  {/* Pulsing notification dot when playing */}
                  {musicEnabled && (
                    <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5 z-20">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-cyan to-neon-pink shadow-[0_0_6px_#00F5FF]" />
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Sound Effects Toggle (Click SFX) */}
              <button
                onClick={() => { setSoundEnabled(!soundEnabled); playClick() }}
                className={cn(
                  'w-8 h-8 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all flex items-center justify-center border',
                  soundEnabled ? 'border-white/[0.08] text-cyan' : 'border-white/[0.04] text-text-secondary/40'
                )}
                title={soundEnabled ? 'Click Sound Effects: ON (Click to mute)' : 'Click Sound Effects: OFF (Click to enable)'}
              >
                {soundEnabled ? <Volume2 size={14} className="text-cyan" /> : <VolumeX size={14} />}
              </button>

              {/* Command palette shortcut */}
              <button
                onClick={() => { setCommandPaletteOpen(true); playClick() }}
                className="hidden xl:flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary border border-white/[0.06] hover:border-cyan/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all leading-none"
              >
                <Command size={11} />
                <span>⌘K</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  onClick={() => {
                    setIsRoleDropdownOpen((prev) => !prev);
                    playClick();
                  }}
                  className={cn(
                    'flex items-center gap-1.5 h-8 px-2.5 rounded-lg border backdrop-blur-md transition-all duration-200 text-xs sm:text-sm font-medium leading-none cursor-pointer select-none',
                    isRoleDropdownOpen
                      ? 'bg-cyan/15 border-cyan/50 text-cyan shadow-[0_0_14px_rgba(0,229,255,0.22)]'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-cyan/25 hover:border-cyan/45 text-text-primary'
                  )}
                  title="View as role"
                >
                  <span className="text-sm">{currentRole.icon}</span>
                  <span className="font-medium hidden sm:block max-w-28 truncate leading-none">
                    {currentRole.shortLabel}
                  </span>
                  <ChevronDown
                    size={12}
                    className={cn(
                      'transition-transform duration-300 ease-out text-text-secondary',
                      isRoleDropdownOpen && 'rotate-180 text-cyan'
                    )}
                  />
                </motion.button>

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
                        className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] glass-dropdown rounded-2xl overflow-hidden max-h-[calc(100vh-5.5rem)] flex flex-col border border-white/[0.08] shadow-2xl"
                        style={{ zIndex: 300 }}
                      >
                        <div className="px-4 py-2.5 flex-shrink-0 border-b border-white/[0.06] bg-white/[0.02]">
                          <p className="text-xs font-mono text-text-secondary uppercase tracking-widest">
                            View As
                          </p>
                        </div>
                        <div className="p-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
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
                                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all hover:translate-x-0.5',
                                  activeRole === role.id
                                    ? 'bg-cyan/15 border border-cyan/30 text-text-primary shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                                )}
                              >
                                <span className="text-base">{role.icon}</span>
                                <div className="text-left">
                                  <div className="font-medium text-sm leading-snug">{role.label}</div>
                                  <div className="text-xs text-text-secondary leading-snug">{role.description}</div>
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

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden w-8 h-8 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all flex items-center justify-center"
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
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden mt-2 glass-dropdown rounded-2xl overflow-hidden max-h-[calc(100vh-5rem)] flex flex-col border border-white/[0.08] shadow-2xl"
            >
              <div className="p-3 sm:p-4 space-y-0.5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
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
                      'block px-4 py-2.5 rounded-xl text-base font-medium transition-all leading-normal',
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
                      'relative group flex items-center gap-3 text-xs font-semibold transition-all py-2.5 px-3.5 rounded-xl border leading-none overflow-hidden',
                      musicEnabled || isMusicPlayerOpen
                        ? 'bg-gradient-to-r from-cyan/20 via-purple-500/15 to-pink-500/20 border-cyan/40 text-cyan shadow-[0_0_16px_rgba(0,229,255,0.3)]'
                        : 'border-white/[0.08] text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                    )}
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <SoundLoungeVortexUI isHovered={true} isPlaying={musicEnabled} />
                      <Music size={14} className="relative z-10 text-cyan drop-shadow-[0_0_6px_#00E5FF]" />
                    </div>
                    <span>{musicEnabled ? 'Sound Lounge (Playing)' : 'Sound Lounge'}</span>
                    {musicEnabled && (
                      <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_#00E5FF] animate-ping ml-auto" />
                    )}
                  </button>

                  <button
                    onClick={() => { setSoundEnabled(!soundEnabled); playClick() }}
                    className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-all py-1.5 px-2 leading-none"
                  >
                    {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    <span>{soundEnabled ? 'SFX: On' : 'SFX: Off'}</span>
                  </button>

                  <button
                    onClick={() => { setCommandPaletteOpen(true); playClick(); setIsMobileMenuOpen(false) }}
                    className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-all py-1.5 px-2 ml-auto leading-none"
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
