'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Command, Volume2, VolumeX } from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { roles, navItems, personalInfo } from '@/data/portfolio'
import { useScrollProgress, useSound } from '@/hooks'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { activeRole, setActiveRole, activeSection, isCommandPaletteOpen, setCommandPaletteOpen, soundEnabled, setSoundEnabled } =
    usePortfolioStore()
  const scrollProgress = useScrollProgress()
  const { playClick } = useSound()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)

  const currentRole = roles.find((r) => r.id === activeRole) || roles[0]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    playClick()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
        style={{
          background: 'linear-gradient(90deg, #00E5FF, #7C3AED)',
          scaleX: scrollProgress,
          transformOrigin: 'left',
        }}
      />

      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'py-3' : 'py-5'
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl px-6 transition-all duration-300',
            isScrolled &&
              'glass rounded-2xl border border-white/[0.07] shadow-glass mx-4 px-4'
          )}
        >
          <div className="flex items-center justify-between h-14">
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
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.href)
                    playClick()
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
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
            <div className="flex items-center gap-2">
              {/* Sound toggle */}
              <button
                onClick={() => { setSoundEnabled(!soundEnabled); playClick() }}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all hidden md:flex"
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              {/* Command palette shortcut */}
              <button
                onClick={() => { setCommandPaletteOpen(true); playClick() }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary border border-white/[0.06] hover:border-cyan/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
              >
                <Command size={12} />
                <span>⌘K</span>
              </button>

              {/* Role Selector */}
              <div className="relative">
                <motion.button
                  onClick={() => { setIsRoleDropdownOpen(!isRoleDropdownOpen); playClick() }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-cyan/20 hover:border-cyan/40 transition-all text-sm"
                  whileTap={{ scale: 0.97 }}
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
                </motion.button>

                <AnimatePresence>
                  {isRoleDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.19, 1, 0.22, 1] }}
                      className="absolute top-full right-0 mt-2 w-60 glass-strong rounded-2xl border border-white/[0.1] shadow-glass-lg overflow-hidden"
                      style={{ zIndex: 200 }}
                    >
                      <div className="p-2">
                        <p className="px-3 py-2 text-xs font-mono text-text-secondary uppercase tracking-widest">
                          View As
                        </p>
                        <div className="space-y-0.5">
                          {roles.map((role) => (
                            <motion.button
                              key={role.id}
                              onClick={() => {
                                setActiveRole(role.id)
                                setIsRoleDropdownOpen(false)
                                playClick()
                              }}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                                activeRole === role.id
                                  ? 'bg-cyan/10 border border-cyan/20 text-text-primary'
                                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                              )}
                              whileHover={{ x: 2 }}
                            >
                              <span className="text-base">{role.icon}</span>
                              <div className="text-left">
                                <div className="font-medium text-sm">{role.label}</div>
                                <div className="text-xs text-text-secondary">{role.description}</div>
                              </div>
                              {activeRole === role.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all"
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
              className="lg:hidden mx-4 mt-2 glass-strong rounded-2xl border border-white/[0.08] overflow-hidden"
            >
              <div className="p-4 space-y-1">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Click outside to close dropdown */}
      {isRoleDropdownOpen && (
        <div
          className="fixed inset-0 z-[150]"
          onClick={() => setIsRoleDropdownOpen(false)}
        />
      )}
    </>
  )
}
