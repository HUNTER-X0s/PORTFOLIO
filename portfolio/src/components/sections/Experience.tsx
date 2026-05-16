'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Calendar, ChevronDown, ChevronUp, ExternalLink,
  Code2, Zap, CheckCircle2, Award, Briefcase, GraduationCap,
  Layers, GitBranch
} from 'lucide-react'
import { useInView } from '@/hooks'
import { enhancedExperiences, type EnhancedExperience, type InternshipProject } from '@/data/experience'
import { education } from '@/data/portfolio'
import { certifications } from '@/data/certifications'
import { cn } from '@/lib/utils'
import { StaggerReveal, staggerItemLeft } from '@/components/animations/ScrollReveal'

// ── Project expandable card ────────────────────────────────
function ProjectCard({ project, accentColor }: { project: InternshipProject; accentColor: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ background: `${accentColor}06`, border: `1px solid ${accentColor}18` }}
    >
      {/* Project header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}25` }}
          >
            <Code2 size={14} style={{ color: accentColor }} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-text-primary leading-snug">{project.name}</h4>
            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{project.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg"
              style={{ background: `${accentColor}10`, color: accentColor }}
            >
              <GitBranch size={9} /> GitHub
            </a>
          )}
          {expanded ? (
            <ChevronUp size={14} className="text-text-secondary" />
          ) : (
            <ChevronDown size={14} className="text-text-secondary" />
          )}
        </div>
      </button>

      {/* Expanded project details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-white/[0.04]">
              {/* Problem / Solution */}
              <div className="grid sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(255,45,156,0.05)', border: '1px solid rgba(255,45,156,0.12)' }}>
                  <p className="text-[10px] font-mono text-neon-pink uppercase tracking-widest mb-1.5">Problem</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{project.problem}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)' }}>
                  <p className="text-[10px] font-mono text-cyan uppercase tracking-widest mb-1.5">Solution</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{project.solution}</p>
                </div>
              </div>

              {/* Architecture */}
              {project.architecture && project.architecture.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Layers size={9} /> Architecture
                  </p>
                  <div className="space-y-1.5">
                    {project.architecture.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="text-[10px] font-mono mt-0.5 flex-shrink-0" style={{ color: accentColor }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech stack */}
              <div>
                <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-2">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded font-mono"
                      style={{ background: `${accentColor}10`, color: accentColor, border: `1px solid ${accentColor}20` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div
                className="p-3 rounded-lg flex items-start gap-2"
                style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}15` }}
              >
                <Zap size={12} style={{ color: accentColor }} className="mt-0.5 flex-shrink-0" />
                <p className="text-xs leading-relaxed" style={{ color: accentColor }}>
                  <span className="font-semibold">Impact: </span>{project.impact}
                </p>
              </div>

              {/* Results */}
              {project.results && project.results.length > 0 && (
                <div className="space-y-1.5">
                  {project.results.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                      <CheckCircle2 size={11} className="mt-0.5 flex-shrink-0 text-neon-green" />
                      {r}
                    </div>
                  ))}
                </div>
              )}

              {/* Links */}
              {(project.githubUrl || project.liveUrl) && (
                <div className="flex gap-2 pt-1">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}25`, color: accentColor }}>
                      <GitBranch size={11} /> View Repository
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass border border-white/[0.08] text-text-secondary hover:text-text-primary transition-all">
                      <ExternalLink size={11} /> Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Single experience card ─────────────────────────────────
function ExperienceCard({ exp, isLast }: { exp: EnhancedExperience; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const cert = certifications.find((c) => c.id === exp.certificationId)

  const locationIcon = exp.locationType === 'hybrid' ? '🏢' : exp.locationType === 'onsite' ? '🏛️' : '🌐'

  return (
    <motion.div variants={staggerItemLeft} className="relative pl-10">
      {/* Timeline dot */}
      <div className="absolute left-0 top-2">
        <div className="relative">
          <div
            className="w-3 h-3 rounded-full border-2 border-surface-1 z-10 relative"
            style={{
              background: exp.companyColor,
              boxShadow: `0 0 12px ${exp.companyColor}70`,
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-ping-slow opacity-25"
            style={{ background: exp.companyColor }}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Card top accent */}
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, ${exp.companyColor}, transparent 60%)` }}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${exp.companyColor}12`, border: `1.5px solid ${exp.companyColor}28` }}
              >
                🏢
              </div>
              <div>
                <h3 className="font-display font-bold text-text-primary text-base leading-tight">{exp.role}</h3>
                <p className="text-sm font-semibold mt-0.5" style={{ color: exp.companyColor }}>
                  {exp.companyFullName}
                </p>
              </div>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-mono flex-shrink-0 capitalize"
              style={{ background: `${exp.companyColor}10`, border: `1px solid ${exp.companyColor}22`, color: exp.companyColor }}
            >
              {exp.roleType}
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {exp.startDate} – {exp.endDate} · {exp.duration}
            </span>
            <span className="flex items-center gap-1.5">
              {locationIcon} {exp.location.split(',')[0]}
              <span className="text-text-tertiary capitalize">({exp.locationType})</span>
            </span>
          </div>

          {/* Overview */}
          <p className="text-sm text-text-secondary leading-relaxed mb-4">{exp.overview}</p>

          {/* Responsibilities (collapsible) */}
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors mb-3"
            >
              <Briefcase size={11} />
              Responsibilities & Achievements
              {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1.5 mb-4">
                    {exp.responsibilities.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: exp.companyColor }} />
                        {r}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {exp.techStack.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-md font-mono text-text-secondary bg-white/[0.03] border border-white/[0.06]">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exp.achievements.map((a) => (
                      <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-neon-green/8 border border-neon-green/15 text-neon-green">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Projects — always visible */}
          {exp.projects.length > 0 && (
            <div>
              <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Code2 size={10} style={{ color: exp.companyColor }} />
                What I Built Here ({exp.projects.length} project{exp.projects.length > 1 ? 's' : ''})
              </p>
              <div className="space-y-3">
                {exp.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} accentColor={exp.companyColor} />
                ))}
              </div>
            </div>
          )}

          {/* Cert badge */}
          {cert && (
            <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{cert.badge}</span>
                <div>
                  <p className="text-xs font-medium text-text-primary">{cert.title.slice(0, 45)}…</p>
                  <p className="text-[10px] text-text-secondary font-mono">{cert.issueDate}</p>
                </div>
              </div>
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono px-2.5 py-1 rounded-lg transition-all"
                style={{ background: `${cert.issuerColor}10`, border: `1px solid ${cert.issuerColor}25`, color: cert.issuerColor }}
              >
                View Cert →
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Education card ─────────────────────────────────────────
function EducationCard({ edu, index }: { edu: typeof education[0]; index: number }) {
  const color = index === 0 ? '#7C3AED' : index === 1 ? '#FF2D9C' : '#00E5FF'
  return (
    <motion.div variants={staggerItemLeft} className="relative pl-10">
      <div className="absolute left-0 top-2">
        <div
          className="w-3 h-3 rounded-full border-2 border-surface-1"
          style={{ background: color, boxShadow: `0 0 10px ${color}60` }}
        />
      </div>
      <div className="glass-card p-5">
        <div className="absolute top-0 left-0 right-0 h-[2px] opacity-50"
          style={{ background: `linear-gradient(90deg, ${color}, transparent 50%)` }} />
        <h4 className="font-display font-semibold text-text-primary">{edu.degree}</h4>
        <p className="text-sm font-medium mt-0.5" style={{ color }}>{edu.institution}</p>
        <p className="text-sm text-text-secondary mt-0.5">{edu.field}</p>
        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1.5 text-text-secondary">
            <Calendar size={10} />{edu.duration}
          </span>
          {edu.grade && <span className="text-neon-green font-mono font-medium">{edu.grade}</span>}
        </div>
        {edu.activities.length > 0 && (
          <div className="mt-3 space-y-1.5 pt-3 border-t border-white/[0.05]">
            {edu.activities.map((a) => (
              <div key={a} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: color }} />{a}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function ExperienceSection() {
  const { ref, inView } = useInView(0.05)

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
            <p className="section-label">04 / Experience</p>
            <h2 className="section-title">
              Professional <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-text-secondary mt-3 max-w-xl">
              5 internships · 5 companies · ~12 months of hands-on industry experience in 2025.
              Every internship linked to real projects with measurable impact.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {[
              { label: 'Internships', value: '5', color: '#00E5FF' },
              { label: 'Projects Built', value: '6+', color: '#7C3AED' },
              { label: 'Months Experience', value: '~12', color: '#00FF87' },
              { label: 'Certs Earned', value: '7', color: '#FFE500' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 glass border border-white/[0.07] px-4 py-2.5 rounded-xl">
                <span className="font-display font-bold text-lg" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs text-text-secondary font-mono">{s.label}</span>
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Work experience column */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-8">
                <Briefcase size={16} className="text-cyan" />
                <h3 className="font-display font-semibold text-text-primary">Work Experience</h3>
                <span className="text-xs font-mono text-text-secondary ml-1">({enhancedExperiences.length} roles)</span>
              </motion.div>

              <div className="relative">
                <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gradient-to-b from-cyan/40 via-violet/20 to-transparent" />
                <StaggerReveal className="space-y-6">
                  {enhancedExperiences.map((exp, i) => (
                    <ExperienceCard key={exp.id} exp={exp} isLast={i === enhancedExperiences.length - 1} />
                  ))}
                </StaggerReveal>
              </div>
            </div>

            {/* Education column */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }}
                className="flex items-center gap-2 mb-8">
                <GraduationCap size={16} className="text-violet" />
                <h3 className="font-display font-semibold text-text-primary">Education</h3>
              </motion.div>

              <div className="relative">
                <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gradient-to-b from-violet/40 via-neon-pink/20 to-transparent" />
                <StaggerReveal className="space-y-6" delay={0.1}>
                  {education.map((edu, i) => <EducationCard key={edu.institution} edu={edu} index={i} />)}
                </StaggerReveal>
              </div>

              {/* Awards */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="mt-8">
                <h4 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Award size={14} className="text-neon-orange" />
                  Clubs & Activities
                </h4>
                <div className="space-y-2.5">
                  {[
                    { title: 'KiloBots Robotics Club', desc: 'Member · GCE Kalahandi — automation & embedded systems', color: '#00E5FF' },
                    { title: 'Ashoka House Sports Captain', desc: 'Kendriya Vidyalaya — led house in athletics & inter-house events', color: '#00FF87' },
                    { title: 'Tech-Fest Volunteer', desc: 'GCE Kalahandi — event organization and coordination', color: '#7C3AED' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-xl glass border border-white/[0.06]">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{item.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
