'use client'

import { motion } from 'framer-motion'
import { Calendar, GraduationCap, Award, Trophy, Users, Code2, Cpu } from 'lucide-react'
import { useInView } from '@/hooks'
import { education } from '@/data/portfolio'
import { StaggerReveal, staggerItemLeft } from '@/components/animations/ScrollReveal'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

// ── Education card (full-width) ─────────────────────────────
function EducationCard({ edu, index }: { edu: typeof education[0]; index: number }) {
  const colors = ['#7C3AED', '#FF2D9C', '#00E5FF']
  const color = colors[index] ?? '#7C3AED'

  return (
    <motion.div variants={staggerItemLeft} className="relative pl-10">
      {/* Timeline dot */}
      <div className="absolute left-0 top-3">
        <div
          className="w-3 h-3 rounded-full border-2 border-surface-1"
          style={{ background: color, boxShadow: `0 0 12px ${color}80` }}
        />
      </div>

      <Dynamic3DCard intensity={10} depth={18} glowColor={`${color}25`}>
        <div className="glass-card p-6 relative overflow-hidden">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}40 60%, transparent)` }}
        />
        {/* Subtle glow bg */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-[0.04]"
          style={{ background: color, filter: 'blur(60px)', transform: 'translate(30%, -30%)' }}
        />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-lg text-text-primary leading-tight">
              {edu.degree}
            </h4>
            <p className="text-base font-medium mt-1" style={{ color }}>
              {edu.institution}
            </p>
            <p className="text-sm text-text-secondary mt-0.5">{edu.field}</p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
            <span
              className="flex items-center gap-1.5 text-xs text-text-secondary bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full"
            >
              <Calendar size={11} />
              {edu.duration}
            </span>
            {edu.grade && (
              <span className="text-sm text-neon-green font-mono font-semibold bg-neon-green/10 border border-neon-green/20 px-3 py-1.5 rounded-full whitespace-nowrap">
                {edu.grade}
              </span>
            )}
          </div>
        </div>

              {/* Activities */}
              {edu.activities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
                    Highlights
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {edu.activities.map((a) => (
                      <div key={a} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <span
                          className="flex-shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full"
                          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                        />
                        <span className="leading-snug">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </Dynamic3DCard>
      </motion.div>
    )
  }

// ── Club / Activity card ────────────────────────────────────
const clubsData = [
  {
    icon: Cpu,
    title: 'KiloBots Robotics Club',
    org: 'GCE Kalahandi',
    role: 'Active Member',
    color: '#00E5FF',
    details: [
      'Contributed to automation and embedded systems projects',
      'Worked with microcontrollers and sensor integration',
      'Collaborated on competitive robotics challenges',
    ],
  },
  {
    icon: Trophy,
    title: 'Ashoka House Sports Captain',
    org: 'Kendriya Vidyalaya No-6, Bhubaneswar',
    role: 'House Captain',
    color: '#00FF87',
    details: [
      'Led house team in inter-house athletics and sports events',
      'Coordinated team strategy and player motivation',
      'Represented the house across multiple sports disciplines',
    ],
  },
  {
    icon: Code2,
    title: 'Tech-Fest Volunteer',
    org: 'GCE Kalahandi',
    role: 'Event Organizer',
    color: '#7C3AED',
    details: [
      'Organized and coordinated technical event logistics',
      'Managed participant registration and event scheduling',
      'Promoted innovation and technology-driven learning',
    ],
  },
  {
    icon: Users,
    title: 'Cultural & Sports Events',
    org: 'GCE Kalahandi',
    role: 'Volunteer',
    color: '#FF2D9C',
    details: [
      'Volunteered in multiple college-level cultural fests',
      'Active in sports competitions — badminton, chess',
      'Bridging technical and social student communities',
    ],
  },
]

// ── Main component ──────────────────────────────────────────
export default function EducationSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <div className="py-10 sm:py-14 md:py-20">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-header"
          >
            <p className="section-label">05 / Education</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Academic <span className="text-gradient">Background</span>
              </h2>
            </Dynamic3DText>
            <p className="text-text-secondary mt-3 max-w-xl">
              My formal education, extracurricular leadership, and active involvement in technical communities.
            </p>
          </motion.div>

          {/* ── Education (full-width) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mt-12 mb-8"
          >
            <GraduationCap size={16} className="text-violet" />
            <h3 className="font-display font-semibold text-text-primary text-3d-interactive">Education</h3>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gradient-to-b from-violet/40 via-neon-pink/20 to-transparent" />
            <StaggerReveal className="space-y-6">
              {education.map((edu, i) => (
                <EducationCard key={`${edu.institution}-${edu.degree}`} edu={edu} index={i} />
              ))}
            </StaggerReveal>
          </div>

          {/* ── Clubs & Activities ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-16 mb-8"
          >
            <Award size={16} className="text-neon-orange" />
            <h3 className="font-display font-semibold text-text-primary text-3d-interactive">Clubs &amp; Activities</h3>
          </motion.div>

          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-4" delay={0.1}>
            {clubsData.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  variants={staggerItemLeft}
                  className="h-full"
                >
                  <Dynamic3DCard intensity={12} depth={18} glowColor={`${item.color}30`} className="h-full">
                    <div className="relative glass-card p-5 flex flex-col gap-4 overflow-hidden group h-full">
                      {/* Top accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, ${item.color}, transparent 80%)` }}
                      />

                      {/* Icon + role badge */}
                      <div className="flex items-start justify-between">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                        >
                          <Icon size={18} style={{ color: item.color }} />
                        </div>
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{
                            color: item.color,
                            background: `${item.color}15`,
                            border: `1px solid ${item.color}25`,
                          }}
                        >
                          {item.role}
                        </span>
                      </div>

                      {/* Title + org */}
                      <div>
                        <p className="text-lg font-semibold text-text-primary leading-snug text-3d-interactive">{item.title}</p>
                        <p className="text-sm text-text-secondary mt-1">{item.org}</p>
                      </div>

                      {/* Detail bullets */}
                      <ul className="space-y-2.5 mt-auto">
                        {item.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span
                              className="flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full"
                              style={{ background: item.color }}
                            />
                            <span className="leading-relaxed">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Dynamic3DCard>
                </motion.div>
              )
            })}
          </StaggerReveal>
        </div>
      </div>
    </div>
  )
}
