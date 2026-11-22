'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, X, ChevronRight, Zap, CheckCircle2 } from 'lucide-react'
import { useInView } from '@/hooks'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { projects, roles } from '@/data/portfolio'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

function TechBadge({ tech }: { tech: string }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-mono font-medium text-text-secondary border border-white/[0.08] bg-white/[0.03]">
      {tech}
    </span>
  )
}

function StatusBadge({ status }: { status: Project['status'] }) {
  const config = {
    live: { label: 'Live', color: '#00FF87' },
    'in-progress': { label: 'In Progress', color: '#FFE500' },
    archived: { label: 'Archived', color: '#8B8BA7' },
  }[status]

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full animate-ping-slow"
        style={{ background: config.color }}
      />
      <span className="text-xs font-mono font-medium" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  )
}

function ProjectCard({ project, index, onClick }: {
  project: Project; index: number; onClick: () => void
}) {
  const roleColor = roles.find((r) => r.id === project.roles[0])?.color || '#00E5FF'

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Dynamic3DCard
        intensity={14}
        depth={22}
        glowColor={`${roleColor}30`}
        onClick={onClick}
        className="h-full cursor-pointer"
      >
        <div className="glass-card group h-full overflow-hidden relative p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          {/* Top gradient accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
            style={{ background: `linear-gradient(90deg, transparent, ${roleColor}, transparent)` }}
          />

          <div className="space-y-3.5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {project.badge && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1">
                      {project.badge}
                    </span>
                  )}
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium"
                    style={{ background: `${roleColor}15`, color: roleColor, border: `1px solid ${roleColor}30` }}
                  >
                    {project.category}
                  </span>
                  <span className="text-xs text-text-secondary font-mono">{project.year}</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary leading-tight group-hover:text-cyan transition-colors text-3d-interactive">
                  {project.title}
                </h3>
              </div>
              <StatusBadge status={project.status} />
            </div>

            {/* Tagline */}
            <p className="text-text-secondary text-base sm:text-[17px] leading-relaxed">{project.tagline}</p>

            {/* Impact highlight */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-xl transition-all"
              style={{ background: `${roleColor}0c`, border: `1px solid ${roleColor}20` }}
            >
              <Zap size={15} style={{ color: roleColor }} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm sm:text-base font-semibold" style={{ color: roleColor }}>{project.impact}</p>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.slice(0, 5).map((t) => (
                <TechBadge key={t} tech={t} />
              ))}
              {project.tech.length > 5 && (
                <span className="text-xs text-text-secondary px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] font-mono">
                  +{project.tech.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-cyan hover:text-cyan/80 transition-colors btn-3d"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors btn-3d"
                >
                  <Github size={14} />
                  Code
                </a>
              )}
            </div>
            <button className="flex items-center gap-1 text-xs font-mono text-text-secondary group-hover:text-cyan transition-colors btn-3d">
              Details
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </Dynamic3DCard>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const roleColor = roles.find((r) => r.id === project.roles[0])?.color || '#00E5FF'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        className="w-full sm:max-w-2xl glass-dropdown rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="p-4 sm:p-6 border-b border-white/[0.06] flex items-start justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {project.badge && (
                <span className="text-xs sm:text-sm px-3 py-1 rounded-full font-mono font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1">
                  {project.badge}
                </span>
              )}
              <span
                className="text-xs sm:text-sm px-3 py-1 rounded-full font-mono font-medium"
                style={{ background: `${roleColor}12`, color: roleColor, border: `1px solid ${roleColor}22` }}
              >
                {project.category}
              </span>
              <StatusBadge status={project.status} />
              <span className="text-xs sm:text-sm text-text-secondary font-mono">{project.year}</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">{project.title}</h2>
            <p className="text-text-secondary mt-1.5 text-base sm:text-lg leading-relaxed">{project.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-6">
          {/* Links */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all"
              style={{
                background: `${roleColor}14`,
                border: `1px solid ${roleColor}30`,
                color: roleColor,
              }}
            >
              <ExternalLink size={16} />
              View Live Project
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium text-text-secondary border border-white/[0.09] glass hover:border-white/20 hover:text-text-primary transition-all"
              >
                <Github size={16} />
                Source Code
              </a>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs sm:text-sm font-mono text-text-secondary uppercase tracking-widest mb-2.5 font-medium">Overview</h4>
            <p className="text-text-secondary text-base leading-relaxed">{project.description}</p>
          </div>

          {/* Problem & Solution */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'rgba(255,45,156,0.05)', border: '1px solid rgba(255,45,156,0.12)' }}>
              <h4 className="text-xs sm:text-sm font-mono text-neon-pink uppercase tracking-widest mb-2.5 font-medium">The Problem</h4>
              <p className="text-base text-text-secondary leading-relaxed">{project.problem}</p>
            </div>
            <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)' }}>
              <h4 className="text-xs sm:text-sm font-mono text-cyan uppercase tracking-widest mb-2.5 font-medium">The Solution</h4>
              <p className="text-base text-text-secondary leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="text-xs sm:text-sm font-mono text-text-secondary uppercase tracking-widest mb-3 font-medium">Architecture</h4>
            <div className="space-y-2.5">
              {project.architecture.map((arch, i) => (
                <div key={i} className="flex items-start gap-2.5 text-base text-text-secondary">
                  <ChevronRight size={16} className="text-cyan mt-1 flex-shrink-0" />
                  {arch}
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <h4 className="text-xs sm:text-sm font-mono text-neon-green uppercase tracking-widest mb-3 font-medium">Results & Impact</h4>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {project.results.map((result, i) => (
                <div key={i} className="flex items-start gap-2.5 text-base text-text-secondary">
                  <CheckCircle2 size={16} className="text-neon-green mt-1 flex-shrink-0" />
                  {result}
                </div>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-xs sm:text-sm font-mono text-text-secondary uppercase tracking-widest mb-3 font-medium">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <TechBadge key={t} tech={t} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

type ProjectFilter =
  | 'all'
  | 'competitions'
  | 'cybersecurity'
  | 'ai'
  | 'ml'
  | 'mern'
  | 'networking'
  | 'languages'

const filterTabs = [
  { id: 'all', label: 'All Projects', icon: '⚡' },
  { id: 'competitions', label: 'Hackathons & Challenges', icon: '🏆' },
  { id: 'cybersecurity', label: 'Cybersecurity & Blockchain', icon: '🛡️' },
  { id: 'ai', label: 'AI & Agents', icon: '🤖' },
  { id: 'ml', label: 'Machine Learning & Data', icon: '📊' },
  { id: 'mern', label: 'MERN & Full-Stack', icon: '💻' },
  { id: 'networking', label: 'Networking & DevOps', icon: '🌐' },
  { id: 'languages', label: 'Core CS & Languages', icon: '⚙️' },
] as const

export default function Projects() {
  const { ref, inView } = useInView(0.05)
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<ProjectFilter>('all')

  const getTabCount = (f: ProjectFilter) => {
    if (f === 'all') return projects.length
    if (f === 'competitions') return projects.filter(p => !!p.competition || !!p.badge?.includes('Hackathon') || !!p.badge?.includes('Challenge') || !!p.badge?.includes('Govt') || !!p.badge?.includes('NIC')).length
    if (f === 'cybersecurity') return projects.filter(p => p.category.toLowerCase().includes('cyber') || p.category.toLowerCase().includes('block')).length
    if (f === 'ai') return projects.filter(p => p.category.toLowerCase().includes('ai') && !p.category.toLowerCase().includes('machine')).length
    if (f === 'ml') return projects.filter(p => p.category.toLowerCase().includes('machine') || p.category.toLowerCase().includes('data')).length
    if (f === 'mern') return projects.filter(p => p.category.toLowerCase().includes('mern') || p.category.toLowerCase().includes('full-stack') || p.category.toLowerCase().includes('web')).length
    if (f === 'networking') return projects.filter(p => p.category.toLowerCase().includes('network') || p.category.toLowerCase().includes('cloud') || p.category.toLowerCase().includes('devops') || p.roles.includes('devops') || p.roles.includes('networking')).length
    if (f === 'languages') return projects.filter(p => p.category.toLowerCase().includes('core') || p.category.toLowerCase().includes('language')).length
    return 0
  }

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'competitions') return !!p.competition || !!p.badge?.includes('Hackathon') || !!p.badge?.includes('Challenge') || !!p.badge?.includes('Govt') || !!p.badge?.includes('NIC')
    if (filter === 'cybersecurity') return p.category.toLowerCase().includes('cyber') || p.category.toLowerCase().includes('block')
    if (filter === 'ai') return p.category.toLowerCase().includes('ai') && !p.category.toLowerCase().includes('machine')
    if (filter === 'ml') return p.category.toLowerCase().includes('machine') || p.category.toLowerCase().includes('data')
    if (filter === 'mern') return p.category.toLowerCase().includes('mern') || p.category.toLowerCase().includes('full-stack') || p.category.toLowerCase().includes('web')
    if (filter === 'networking') return p.category.toLowerCase().includes('network') || p.category.toLowerCase().includes('cloud') || p.category.toLowerCase().includes('devops') || p.roles.includes('devops') || p.roles.includes('networking')
    if (filter === 'languages') return p.category.toLowerCase().includes('core') || p.category.toLowerCase().includes('language')
    return true
  })

  return (
    <div className="py-10 sm:py-14 md:py-20">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          {/* Header */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="section-header"
          >
            <p className="section-label">03 / Projects</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                What I&apos;ve <span className="text-gradient">Built</span>
              </h2>
            </Dynamic3DText>
            <p className="section-subtitle">
              Real-world applications solving real problems — spanning AI/ML Systems, Computer Vision, Cybersecurity, Cloud Infrastructure, and Full-Stack MERN apps.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 sm:gap-2.5 mb-8 flex-wrap"
          >
            {filterTabs.map((tab) => {
              const count = getTabCount(tab.id)
              const isActive = filter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    'px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap btn-3d',
                    isActive
                      ? 'bg-cyan/15 border border-cyan/40 text-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)] font-semibold'
                      : 'text-text-secondary border border-white/[0.08] glass hover:border-white/20 hover:text-text-primary'
                  )}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      'text-[11px] font-mono px-2 py-0.5 rounded-full',
                      isActive ? 'bg-cyan/25 text-cyan' : 'bg-white/[0.06] text-text-secondary'
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </motion.div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

