'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Download, Github, ExternalLink, Sparkles, Linkedin } from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { personalInfo, roleContents, roles } from '@/data/portfolio'
import { useSound } from '@/hooks'
import { cn } from '@/lib/utils'

// Animated terminal lines
function Terminal({ lines, active }: { lines: string[]; active: boolean }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (!active) return
    setVisibleLines([])
    setCurrentLine(0)
    setTypedText('')
    setCharIndex(0)
  }, [lines, active])

  useEffect(() => {
    if (!active || currentLine >= lines.length) return
    const line = lines[currentLine]

    if (charIndex < line.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + line[charIndex])
        setCharIndex((i) => i + 1)
      }, 28 + Math.random() * 20)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line])
        setTypedText('')
        setCharIndex(0)
        setCurrentLine((i) => i + 1)
      }, 120)
      return () => clearTimeout(timer)
    }
  }, [active, currentLine, charIndex, lines])

  const getLineClass = (line: string) => {
    if (line.startsWith('$') || line.startsWith('>')) return 'terminal-line-cmd'
    if (line.includes('✓') || line.includes('✨') || line.includes('🤖') || line.includes('🧠') || line.includes('🎨') || line.includes('⚙️') || line.includes('☁️') || line.includes('📊') || line.includes('🔬')) return 'terminal-line-success'
    if (line.includes('Status:')) return 'terminal-line-warn'
    return 'terminal-line-out'
  }

  return (
    <div className="terminal-window w-full max-w-lg">
      {/* Title bar */}
      <div className="terminal-titlebar">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="ml-3 text-xs text-text-secondary font-mono flex-1 text-center">
          Anurag@portfolio ~ zsh
        </span>
      </div>

      {/* Body */}
      <div className="terminal-body min-h-48">
        {visibleLines.map((line, i) => (
          <div key={i} className={cn('flex items-start gap-2', getLineClass(line))}>
            {line.startsWith('$') && (
              <span className="terminal-prompt flex-shrink-0">❯</span>
            )}
            <span>{line.startsWith('$') ? line.slice(2) : line}</span>
          </div>
        ))}

        {/* Currently typing */}
        {currentLine < lines.length && (
          <div className={cn('flex items-start gap-2', getLineClass(lines[currentLine]))}>
            {lines[currentLine].startsWith('$') && (
              <span className="terminal-prompt flex-shrink-0">❯</span>
            )}
            <span>
              {lines[currentLine].startsWith('$') ? typedText.slice(2) : typedText}
              <span className="cursor-blink" />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Floating role badge
function RoleBadge({ role, index }: { role: typeof roles[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2 + index * 0.08, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass border border-white/[0.08] text-text-secondary hover:border-cyan/20 hover:text-text-primary transition-all"
    >
      <span>{role.icon}</span>
      <span>{role.shortLabel}</span>
    </motion.div>
  )
}

export default function Hero() {
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const setActiveRole = usePortfolioStore((s) => s.setActiveRole)
  const { playClick } = useSound()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroY = useTransform(scrollY, [0, 300], [0, -80])

  const content = roleContents[activeRole] || roleContents['fullstack']
  const currentRole = roles.find((r) => r.id === activeRole) || roles.find((r) => r.id === 'fullstack') || roles[0]

  // Dynamically reduce font size for long headlines to prevent bad wrapping
  const headlineLen = (content.hero.headline + content.hero.subheadline).length
  const headlineSizeClass =
    headlineLen > 50
      ? 'text-4xl sm:text-5xl lg:text-[3.25rem]'
      : headlineLen > 35
      ? 'text-4xl sm:text-5xl lg:text-6xl'
      : 'text-5xl sm:text-6xl lg:text-7xl'

  const subheadlineSizeClass =
    headlineLen > 50
      ? 'text-2xl sm:text-3xl lg:text-[2.25rem]'
      : headlineLen > 35
      ? 'text-3xl sm:text-4xl lg:text-[2.75rem]'
      : 'text-4xl sm:text-5xl lg:text-[3.5rem]'

  const handleScroll = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    playClick()
  }

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity: heroOpacity, y: heroY }}
      className="relative min-h-[auto] lg:min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-24 sm:pb-16 px-0"
    >
      {/* HUD scan line */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute left-0 right-0 h-px opacity-20 animate-scan"
          style={{ background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)' }}
        />
      </div>

      <div className="section-container w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-8 items-center">
          {/* Left — Main Content */}
          <div className="space-y-5 sm:space-y-8">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-neon-green/25 text-neon-green">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-ping-slow" />
                <span className="text-xs font-mono font-medium">Available for Opportunities</span>
              </div>
            </motion.div>

            {/* Main headline */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
              >
                <p className="section-label" style={{ marginBottom: '0.5rem' }}>
                  {personalInfo.firstName} {personalInfo.lastName} · B.Tech CSE @ GCEK
                </p>
              </motion.div>

              <motion.h1
                key={`headline-${activeRole}`}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="font-display font-bold leading-[1.1] tracking-tight"
              >
                <span className={cn("block text-text-primary", headlineSizeClass)}>{content.hero.headline}</span>
                <span className={cn("block text-gradient mt-2", subheadlineSizeClass)}>{content.hero.subheadline}</span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              key={`desc-${activeRole}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-xl"
            >
              {content.hero.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3"
            >
              <motion.button
                onClick={() => handleScroll('projects')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm overflow-hidden btn-glow"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.15))',
                  border: '1px solid rgba(0,229,255,0.35)',
                  color: '#F0F0FF',
                }}
              >
                <Sparkles size={15} className="text-cyan" />
                {content.hero.cta}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-text-secondary border border-white/[0.09] glass hover:border-white/20 hover:text-text-primary transition-all"
              >
                <Download size={15} />
                Resume
              </motion.a>

              {personalInfo.social.slice(0, 2).map((s) => (
                <motion.a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl glass border border-white/[0.07] text-text-secondary hover:text-text-primary hover:border-cyan/20 transition-all"
                  title={s.platform}
                >
                  {s.platform === 'GitHub' ? <Github size={17} /> : s.platform === 'LinkedIn' ? <Linkedin size={17} /> : <ExternalLink size={17} />}
                </motion.a>
              ))}
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex items-center gap-4 sm:gap-6 md:gap-8 pt-2 overflow-x-auto no-scrollbar pb-1"
            >
              {[
                { label: 'Projects', value: '6+', color: '#00E5FF' },
                { label: 'Internships', value: '5', color: '#7C3AED' },
                { label: 'Stars', value: '3', color: '#FF6B2B' },
                { label: 'Commits', value: '200+', color: '#00FF87' },
              ].map((stat) => (
                <div key={stat.label} className="text-center flex-shrink-0">
                  <div
                    className="font-display font-bold text-xl"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-secondary font-mono mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Terminal + Role Pills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col items-center lg:items-end gap-4 sm:gap-6 w-full"
          >
            {/* Role selector hint */}
            {/* Terminal — hidden on small phones to save space, visible on sm+ */}
            <div className="w-full max-w-lg hidden sm:block">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-mono text-text-secondary">
                  Viewing as:
                </span>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium"
                  style={{
                    background: `${currentRole.color}15`,
                    border: `1px solid ${currentRole.color}30`,
                    color: currentRole.color,
                  }}
                >
                  {currentRole.icon} {currentRole.label}
                </div>
                <span className="text-xs font-mono text-text-tertiary hidden md:inline">
                  — change in navbar ↑
                </span>
              </div>

              <Terminal lines={content.terminalLines} active={true} />
            </div>

            {/* Role pills */}
            <div className="w-full max-w-lg relative z-20">
              <p className="text-xs font-mono text-text-secondary mb-3">
                Switch perspective :
              </p>
              <div className="flex flex-wrap gap-2">
                {roles.map((role, i) => {
                  const isActive = role.id === activeRole
                  
                  return (
                    <motion.button
                      key={role.id}
                      onClick={() => {
                        if (activeRole !== role.id) {
                          setActiveRole(role.id)
                        }
                        playClick()
                      }}
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.06 }}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        isActive
                          ? "" // Inline styles applied for active color
                          : "glass border border-white/[0.07] text-text-secondary hover:border-cyan/20 hover:text-text-primary"
                      )}
                      style={isActive ? {
                        background: `color-mix(in srgb, ${role.color} 15%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${role.color} 40%, transparent)`,
                        color: role.color,
                        boxShadow: `0 0 12px color-mix(in srgb, ${role.color} 20%, transparent)`,
                      } : {}}
                    >
                      <span>{role.icon}</span>
                      <span>{role.shortLabel}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="hidden sm:flex absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleScroll('about')}
      >
        <span className="text-xs font-mono text-text-secondary tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-white/[0.1] glass flex items-center justify-center"
        >
          <ArrowDown size={14} className="text-text-secondary" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

