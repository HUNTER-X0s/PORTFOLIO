'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, ExternalLink, Code2, Zap, CheckCircle2,
  Award, Briefcase, Layers, GitBranch, X, ChevronRight
} from 'lucide-react'
import { useInView, useSound } from '@/hooks'
import { enhancedExperiences, type EnhancedExperience, type InternshipProject } from '@/data/experience'
import { certifications } from '@/data/certifications'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

// ── Experience Full Details Modal ──────────────────────────
function ExperienceModal({ exp, onClose }: { exp: EnhancedExperience; onClose: () => void }) {
  const { playClick } = useSound()
  const cert = certifications.find((c) => c.id === exp.certificationId)
  const locationIcon = exp.locationType === 'hybrid' ? '🏢' : exp.locationType === 'onsite' ? '🏛️' : '🌐'

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
        className="w-full sm:max-w-3xl glass-dropdown rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col border border-white/[0.1] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top colored accent stripe */}
        <div
          className="h-[3px] w-full flex-shrink-0"
          style={{ background: `linear-gradient(90deg, ${exp.companyColor}, #00E5FF 50%, #7C3AED 100%)` }}
        />

        {/* Pinned Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.06] bg-white/[0.02] flex items-start justify-between gap-4 flex-shrink-0">
          <div className="min-w-0 flex-1">
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span
                className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full capitalize"
                style={{
                  background: `${exp.companyColor}15`,
                  border: `1px solid ${exp.companyColor}30`,
                  color: exp.companyColor,
                }}
              >
                {exp.roleType}
              </span>
              <span className="text-xs font-mono text-text-secondary flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                <Calendar size={11} />
                {exp.startDate} – {exp.endDate} · {exp.duration}
              </span>
              <span className="text-xs font-mono text-text-secondary flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                {locationIcon} {exp.location} <span className="text-text-tertiary capitalize">({exp.locationType})</span>
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary leading-tight">
              {exp.role}
            </h2>
            <p className="text-base sm:text-lg font-medium mt-1" style={{ color: exp.companyColor }}>
              {exp.companyFullName}
            </p>
          </div>

          <button
            onClick={() => { onClose(); playClick() }}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.08] transition-all flex-shrink-0 border border-white/[0.06]"
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto custom-scrollbar p-5 sm:p-7 space-y-6 flex-1 min-h-0">
          {/* Executive Overview */}
          <div>
            <h4 className="text-xs font-mono text-cyan uppercase tracking-widest mb-2 font-semibold flex items-center gap-1.5">
              <Briefcase size={13} /> Overview &amp; Scope
            </h4>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {exp.overview}
            </p>
          </div>

          {/* Key Achievements */}
          {exp.achievements.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-neon-green uppercase tracking-widest mb-2.5 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Key Achievements &amp; Metrics
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {exp.achievements.map((a, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl flex items-start gap-2.5 bg-neon-green/[0.04] border border-neon-green/20"
                  >
                    <CheckCircle2 size={15} className="text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-text-primary leading-relaxed">
                      {a}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {exp.responsibilities.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-3 font-semibold flex items-center gap-1.5">
                <Layers size={13} /> Core Responsibilities
              </h4>
              <div className="space-y-2.5">
                {exp.responsibilities.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm sm:text-[15px] text-text-secondary leading-relaxed">
                    <span
                      className="flex-shrink-0 mt-2 w-2 h-2 rounded-full"
                      style={{ background: exp.companyColor, boxShadow: `0 0 8px ${exp.companyColor}80` }}
                    />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Tech Stack */}
          {exp.techStack.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-2.5 font-semibold">
                Technologies &amp; Tools
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1 rounded-full font-mono text-text-secondary border border-white/[0.08] bg-white/[0.03]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* What I Built Here (Projects Deep-Dive) */}
          {exp.projects.length > 0 && (
            <div className="pt-2 border-t border-white/[0.06]">
              <h4 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-4 font-semibold flex items-center gap-2">
                <Code2 size={14} style={{ color: exp.companyColor }} />
                What I Built Here ({exp.projects.length} Project{exp.projects.length > 1 ? 's' : ''})
              </h4>
              <div className="space-y-5">
                {exp.projects.map((proj) => (
                  <div
                    key={proj.name}
                    className="rounded-2xl p-5 sm:p-6 space-y-4"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${exp.companyColor}25`,
                      boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
                    }}
                  >
                    {/* Project Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h5 className="font-display font-bold text-lg sm:text-xl text-text-primary leading-snug">
                          {proj.name}
                        </h5>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                          {proj.tagline}
                        </p>
                      </div>

                      {/* Project Links */}
                      {(proj.githubUrl || proj.liveUrl) && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-white/[0.08] glass text-text-secondary hover:text-text-primary hover:border-white/20 transition-all"
                            >
                              <GitBranch size={12} /> Source
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg font-medium transition-all"
                              style={{
                                background: `${exp.companyColor}15`,
                                border: `1px solid ${exp.companyColor}30`,
                                color: exp.companyColor,
                              }}
                            >
                              <ExternalLink size={12} /> Live Demo
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Problem & Solution */}
                    <div className="grid sm:grid-cols-2 gap-3.5">
                      <div className="p-4 rounded-xl" style={{ background: 'rgba(255,45,156,0.05)', border: '1px solid rgba(255,45,156,0.14)' }}>
                        <p className="text-xs font-mono text-neon-pink uppercase tracking-widest mb-1.5 font-semibold">The Problem</p>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{proj.problem}</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.14)' }}>
                        <p className="text-xs font-mono text-cyan uppercase tracking-widest mb-1.5 font-semibold">The Solution</p>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{proj.solution}</p>
                      </div>
                    </div>

                    {/* Architecture */}
                    {proj.architecture && proj.architecture.length > 0 && (
                      <div>
                        <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-2 font-semibold flex items-center gap-1.5">
                          <Layers size={11} /> Architecture Pipeline
                        </p>
                        <div className="space-y-2">
                          {proj.architecture.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                              <span
                                className="text-xs font-mono font-bold mt-0.5 flex-shrink-0"
                                style={{ color: exp.companyColor }}
                              >
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Project Tech Stack */}
                    <div>
                      <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-2 font-semibold">
                        Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium"
                            style={{
                              background: `${exp.companyColor}10`,
                              color: exp.companyColor,
                              border: `1px solid ${exp.companyColor}25`,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Impact Banner */}
                    <div
                      className="p-3.5 rounded-xl flex items-start gap-2.5"
                      style={{ background: `${exp.companyColor}08`, border: `1px solid ${exp.companyColor}20` }}
                    >
                      <Zap size={15} style={{ color: exp.companyColor }} className="mt-0.5 flex-shrink-0" />
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: exp.companyColor }}>
                        <span className="font-bold">Measurable Impact: </span>
                        {proj.impact}
                      </p>
                    </div>

                    {/* Results bullet points */}
                    {proj.results && proj.results.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {proj.results.map((res, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary">
                            <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-neon-green" />
                            <span>{res}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificate verified section */}
          {cert && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: `${cert.issuerColor}15`, border: `1px solid ${cert.issuerColor}30` }}
                >
                  <Award size={18} style={{ color: cert.issuerColor }} />
                </div>
                <div>
                  <p className="text-xs font-mono text-text-secondary">Verified Certificate Issued by {cert.issuerShortName}</p>
                  <p className="text-sm font-semibold text-text-primary">{cert.title}</p>
                </div>
              </div>
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex-shrink-0"
                style={{
                  background: `${cert.issuerColor}15`,
                  border: `1px solid ${cert.issuerColor}35`,
                  color: cert.issuerColor,
                }}
              >
                View Credential <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Single experience card on timeline ─────────────────────
function ExperienceCard({
  exp,
  isLast,
  index,
  onOpenModal,
}: {
  exp: EnhancedExperience
  isLast: boolean
  index: number
  onOpenModal: () => void
}) {
  const { playClick, playHover } = useSound()
  const cert = certifications.find((c) => c.id === exp.certificationId)
  const locationIcon = exp.locationType === 'hybrid' ? '🏢' : exp.locationType === 'onsite' ? '🏛️' : '🌐'

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="relative pl-8 sm:pl-10"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-3">
        <div className="relative">
          <div
            className="w-3.5 h-3.5 rounded-full border-2 border-surface-1 z-10 relative"
            style={{
              background: exp.companyColor,
              boxShadow: `0 0 14px ${exp.companyColor}90`,
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-ping-slow opacity-30"
            style={{ background: exp.companyColor }}
          />
        </div>
      </div>

      <Dynamic3DCard
        intensity={10}
        depth={18}
        glowColor={`${exp.companyColor}25`}
        onClick={() => {
          onOpenModal()
          playClick()
        }}
        className="cursor-pointer"
      >
        <div
          onMouseEnter={playHover}
          className="glass-card overflow-hidden group hover:border-cyan/40 transition-all duration-300"
        >
          {/* Card top accent */}
          <div
            className="h-[2px] w-full"
            style={{ background: `linear-gradient(90deg, ${exp.companyColor}, transparent 70%)` }}
          />

          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                  style={{ background: `${exp.companyColor}14`, border: `1.5px solid ${exp.companyColor}30` }}
                >
                  🏢
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary leading-tight group-hover:text-cyan transition-colors text-3d-interactive">
                    {exp.role}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold mt-1 truncate" style={{ color: exp.companyColor }}>
                    {exp.companyFullName}
                  </p>
                </div>
              </div>

              <span
                className="text-xs sm:text-sm px-3 py-1 rounded-full font-mono font-medium flex-shrink-0 capitalize"
                style={{ background: `${exp.companyColor}12`, border: `1px solid ${exp.companyColor}25`, color: exp.companyColor }}
              >
                {exp.roleType}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-text-secondary font-mono mb-3.5">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {exp.startDate} – {exp.endDate} · {exp.duration}
              </span>
              <span className="flex items-center gap-1.5">
                {locationIcon} {exp.location.split(',')[0]}
                <span className="text-text-tertiary capitalize">({exp.locationType})</span>
              </span>
            </div>

            {/* Overview */}
            <p className="text-base sm:text-[17px] text-text-secondary leading-relaxed line-clamp-3 mb-4">
              {exp.overview}
            </p>

            {/* Project Highlight Badge */}
            {exp.projects.length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] group-hover:border-white/[0.1] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Code2 size={15} style={{ color: exp.companyColor }} className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                    Built: {exp.projects[0].name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.projects[0].techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2.5 py-0.5 rounded bg-white/[0.04] text-text-secondary border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                  {exp.projects[0].techStack.length > 4 && (
                    <span className="text-xs font-mono px-2 py-0.5 text-text-tertiary">
                      +{exp.projects[0].techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Key Win Preview */}
            {exp.achievements.length > 0 && (
              <div className="mb-4 flex items-center gap-2 text-xs sm:text-sm font-mono text-neon-green">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span className="truncate">{exp.achievements[0]}</span>
              </div>
            )}

            {/* Footer with Details button */}
            <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                {cert && (
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Award size={13} style={{ color: cert.issuerColor }} />
                    <span className="hidden sm:inline">Verified:</span> {cert.issuerShortName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-cyan group-hover:translate-x-1 transition-all">
                <span>View Full Details</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </Dynamic3DCard>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function ExperienceSection() {
  const { ref, inView } = useInView(0.05)
  const [selectedExp, setSelectedExp] = useState<EnhancedExperience | null>(null)

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
            <p className="section-label">04 / Experience</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Professional <span className="text-gradient">Journey</span>
              </h2>
            </Dynamic3DText>
            <p className="section-subtitle">
              5 internships · 5 organizations · Hands-on engineering &amp; AI experience across Government of India and leading industry firms.
              Every internship linked to real projects with measurable impact.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {[
              { label: 'Internships', value: '5', color: '#00E5FF' },
              { label: 'Projects Built', value: '8+', color: '#7C3AED' },
              { label: 'Months Experience', value: '~13+', color: '#00FF87' },
              { label: 'Certs Earned', value: '8+', color: '#FFE500' },
            ].map((s) => (
              <Dynamic3DCard key={s.label} intensity={14} depth={12} glowColor={`${s.color}25`}>
                <div className="flex items-center gap-2 glass border border-white/[0.08] px-4 py-2.5 rounded-xl h-full">
                  <span className="font-display font-bold text-lg text-3d-interactive" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-xs text-text-secondary font-mono">{s.label}</span>
                </div>
              </Dynamic3DCard>
            ))}
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gradient-to-b from-cyan/40 via-violet/20 to-transparent" />
            <div className="space-y-8">
              {enhancedExperiences.map((exp, i) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  isLast={i === enhancedExperiences.length - 1}
                  index={i}
                  onOpenModal={() => setSelectedExp(exp)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Full Details Modal */}
      <AnimatePresence>
        {selectedExp && (
          <ExperienceModal
            exp={selectedExp}
            onClose={() => setSelectedExp(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
