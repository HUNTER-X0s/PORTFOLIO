'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, X, ChevronRight, Zap, CheckCircle2 } from 'lucide-react'
import { useInView } from '@/hooks'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { projects, roles } from '@/data/portfolio'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

function TechBadge({ tech }: { tech: string }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-mono text-text-secondary border border-white/[0.07] bg-white/[0.02]">
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
        className="w-1.5 h-1.5 rounded-full animate-ping-slow"
        style={{ background: config.color }}
      />
      <span className="text-xs font-mono" style={{ color: config.color }}>
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
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      onClick={onClick}
      className="glass-card group cursor-pointer overflow-hidden relative"
    >
      {/* Top gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${roleColor}, transparent)` }}
      />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-mono font-medium"
                style={{ background: `${roleColor}12`, color: roleColor, border: `1px solid ${roleColor}22` }}
              >
                {project.category}
              </span>
              <span className="text-xs text-text-secondary font-mono">{project.year}</span>
            </div>
            <h3 className="font-display font-bold text-text-primary text-lg leading-tight group-hover:text-cyan transition-colors">
              {project.title}
            </h3>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Tagline */}
        <p className="text-text-secondary text-sm leading-relaxed">{project.tagline}</p>

        {/* Impact highlight */}
        <div
          className="flex items-start gap-2 p-3 rounded-lg"
          style={{ background: `${roleColor}08`, border: `1px solid ${roleColor}15` }}
        >
          <Zap size={14} style={{ color: roleColor }} className="mt-0.5 flex-shrink-0" />
          <p className="text-xs" style={{ color: roleColor }}>{project.impact}</p>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <TechBadge key={t} tech={t} />
          ))}
          {project.tech.length > 5 && (
            <span className="text-xs text-text-secondary px-2.5 py-1 rounded-full border border-white/[0.06]">
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm font-medium text-cyan hover:text-cyan/80 transition-colors"
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <Github size={13} />
                Code
              </a>
            )}
          </div>
          <button className="flex items-center gap-1 text-xs text-text-secondary group-hover:text-cyan transition-colors">
            Details
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
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
      className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-2xl glass-strong rounded-2xl border border-white/[0.1] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="p-6 border-b border-white/[0.06] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-mono"
                style={{ background: `${roleColor}12`, color: roleColor, border: `1px solid ${roleColor}22` }}
              >
                {project.category}
              </span>
              <StatusBadge status={project.status} />
              <span className="text-xs text-text-secondary font-mono">{project.year}</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary">{project.title}</h2>
            <p className="text-text-secondary mt-1 text-sm">{project.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto no-scrollbar p-6 space-y-6">
          {/* Links */}
          <div className="flex items-center gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: `${roleColor}14`,
                border: `1px solid ${roleColor}30`,
                color: roleColor,
              }}
            >
              <ExternalLink size={14} />
              View Live Project
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary border border-white/[0.09] glass hover:border-white/20 hover:text-text-primary transition-all"
              >
                <Github size={14} />
                Source Code
              </a>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">Overview</h4>
            <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>
          </div>

          {/* Problem & Solution */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,45,156,0.05)', border: '1px solid rgba(255,45,156,0.12)' }}>
              <h4 className="text-xs font-mono text-neon-pink uppercase tracking-widest mb-2">The Problem</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{project.problem}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)' }}>
              <h4 className="text-xs font-mono text-cyan uppercase tracking-widest mb-2">The Solution</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-3">Architecture</h4>
            <div className="space-y-2">
              {project.architecture.map((arch, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <ChevronRight size={14} className="text-cyan mt-0.5 flex-shrink-0" />
                  {arch}
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <h4 className="text-xs font-mono text-neon-green uppercase tracking-widest mb-3">Results & Impact</h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {project.results.map((result, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <CheckCircle2 size={14} className="text-neon-green mt-0.5 flex-shrink-0" />
                  {result}
                </div>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-3">Tech Stack</h4>
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

export default function Projects() {
  const { ref, inView } = useInView(0.1)
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<'all' | 'featured'>('all')

  const filteredProjects = projects.filter((p) => {
    if (filter === 'featured') return p.featured
    return true
  })

  return (
    <div className="py-32">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-header"
          >
            <p className="section-label">03 / Projects</p>
            <h2 className="section-title">
              What I&apos;ve <span className="text-gradient">Built</span>
            </h2>
            <p className="text-text-secondary mt-3 max-w-xl">
              Real-world applications solving real problems — each with a live link, full architecture, and measurable results.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            {(['all', 'featured'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize',
                  filter === f
                    ? 'bg-cyan/12 border border-cyan/25 text-cyan'
                    : 'text-text-secondary border border-white/[0.07] glass hover:border-white/20 hover:text-text-primary'
                )}
              >
                {f === 'all' ? `All Projects (${projects.length})` : `Featured (${projects.filter((p) => p.featured).length})`}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 gap-5"
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
