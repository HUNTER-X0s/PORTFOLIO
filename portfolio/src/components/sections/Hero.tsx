'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Download, Github, ExternalLink, Sparkles, Linkedin } from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { personalInfo, roleContents, roles } from '@/data/portfolio'
import { useSound, useWindowSize } from '@/hooks'
import { cn } from '@/lib/utils'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

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
    <div className="terminal-window w-full">
      {/* Title bar */}
      <div className="terminal-titlebar">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs text-text-secondary font-mono flex-1 text-center truncate">
          Anurag@portfolio ~ zsh
        </span>
      </div>

      {/* Body */}
      <div className="terminal-body min-h-[140px] sm:min-h-48">
        {visibleLines.map((line, i) => (
          <div key={i} className={cn('flex items-start gap-1.5 sm:gap-2', getLineClass(line))}>
            {line.startsWith('$') && (
              <span className="terminal-prompt flex-shrink-0">❯</span>
            )}
            <span className="break-words min-w-0">{line.startsWith('$') ? line.slice(2) : line}</span>
          </div>
        ))}

        {/* Currently typing */}
        {currentLine < lines.length && (
          <div className={cn('flex items-start gap-1.5 sm:gap-2', getLineClass(lines[currentLine]))}>
            {lines[currentLine].startsWith('$') && (
              <span className="terminal-prompt flex-shrink-0">❯</span>
            )}
            <span className="break-words min-w-0">
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

  const content = roleContents[activeRole] || roleContents['fullstack']
  const currentRole = roles.find((r) => r.id === activeRole) || roles.find((r) => r.id === 'fullstack') || roles[0]

  // Dynamically reduce font size for long headlines to prevent bad wrapping
  const headlineLen = (content.hero.headline + content.hero.subheadline).length
  const headlineSizeClass =
    headlineLen > 50
      ? 'text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem]'
      : headlineLen > 35
      ? 'text-3xl xs:text-4xl sm:text-5xl lg:text-6xl'
      : 'text-4xl xs:text-5xl sm:text-6xl lg:text-7xl'

  const subheadlineSizeClass =
    headlineLen > 50
      ? 'text-xl xs:text-2xl sm:text-3xl lg:text-[2.25rem]'
      : headlineLen > 35
      ? 'text-2xl xs:text-3xl sm:text-4xl lg:text-[2.75rem]'
      : 'text-3xl xs:text-4xl sm:text-5xl lg:text-[3.5rem]'

  const handleScroll = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    playClick()
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-24 sm:pb-16 px-0"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-8 items-center">
          {/* Left — Main Content */}
          <div className="space-y-6 sm:space-y-8">
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
                <Dynamic3DText intensity={12} enableDepth={true}>
                  <span className={cn("block text-text-primary text-3d-title", headlineSizeClass)}>{content.hero.headline}</span>
                </Dynamic3DText>
                <Dynamic3DText intensity={14} enableDepth={true} glowColor="rgba(0, 229, 255, 0.4)">
                  <span
                    className={cn("block mt-2", subheadlineSizeClass)}
                    style={{
                      background: 'linear-gradient(135deg, #00E5FF 0%, #7C3AED 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                    }}
                  >{content.hero.subheadline}</span>
                </Dynamic3DText>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              key={`desc-${activeRole}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-text-secondary text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl"
            >
              {content.hero.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3 w-full"
            >
              <motion.button
                onClick={() => handleScroll('projects')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="relative group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm overflow-hidden btn-glow btn-3d"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,237,0.2))',
                  border: '1px solid rgba(0,229,255,0.4)',
                  color: '#F0F0FF',
                  boxShadow: '0 4px 20px rgba(0,229,255,0.2)',
                }}
              >
                <Sparkles size={15} className="text-cyan" />
                {content.hero.cta}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/15 to-violet/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-text-secondary border border-white/[0.12] glass hover:border-cyan/40 hover:text-text-primary transition-all btn-3d"
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
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.93 }}
                  className="p-3 rounded-xl glass border border-white/[0.09] text-text-secondary hover:text-text-primary hover:border-cyan/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all btn-3d"
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
              className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-8 pt-2 w-full"
            >
              {[
                { label: 'Projects', value: '6+', color: '#00E5FF' },
                { label: 'Internships', value: '5', color: '#7C3AED' },
                { label: 'Stars', value: '3', color: '#FF6B2B' },
                { label: 'Commits', value: '200+', color: '#00FF87' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-center flex-shrink-0 cursor-default p-2 rounded-xl glass border border-transparent hover:border-white/[0.1] transition-all"
                >
                  <div
                    className="font-display font-bold text-base sm:text-xl text-3d-interactive"
                    style={{ color: stat.color, textShadow: `0 0 14px ${stat.color}40` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-text-secondary font-mono mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 0, y: 24 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col items-stretch lg:items-end gap-4 sm:gap-6 w-full"
          >
            {/* Role selector hint */}
            <div className="w-full">
              <div className="flex flex-wrap items-center gap-2 mb-3">
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
                <span className="text-xs font-mono text-text-tertiary hidden sm:inline">
                  — change in navbar ↑
                </span>
              </div>

              <Dynamic3DCard intensity={12} depth={22} glowColor="rgba(0, 229, 255, 0.2)">
                <Terminal lines={content.terminalLines} active={true} />
              </Dynamic3DCard>
            </div>

            {/* Role pills */}
            <div className="w-full relative z-20">
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
    </div>
  )
}


