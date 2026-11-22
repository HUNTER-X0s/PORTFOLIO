'use client'

import { motion } from 'framer-motion'
import { Calendar, GraduationCap, Award, Trophy, Users, Code2, Cpu } from 'lucide-react'
import { useInView } from '@/hooks'
import { education } from '@/data/portfolio'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

// ── Education card (full-width) ─────────────────────────────
function EducationCard({ edu, index }: { edu: typeof education[0]; index: number }) {
  const colors = ['#7C3AED', '#FF2D9C', '#00E5FF']
  const color = colors[index] ?? '#7C3AED'

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="relative pl-10"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-3">
        <div
          className="w-3 h-3 rounded-full border-2 border-surface-1"
          style={{ background: color, boxShadow: `0 0 12px ${color}80` }}
        />
      </div>

      <Dynamic3DCard intensity={10} depth={18} glowColor={`${color}25`}>
        <div className="glass-card p-5 sm:p-6 relative overflow-hidden">
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
              <h4 className="font-display font-bold text-xl sm:text-2xl text-text-primary leading-tight">
                {edu.degree}
              </h4>
              <p className="text-base sm:text-lg font-semibold mt-1" style={{ color }}>
                {edu.institution}
              </p>
              <p className="text-sm sm:text-base text-text-secondary mt-0.5">{edu.field}</p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
              <span
                className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-medium text-text-secondary bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-full"
              >
                <Calendar size={13} />
                {edu.duration}
              </span>
              {edu.grade && (
                <span className="text-xs sm:text-sm text-neon-green font-mono font-semibold bg-neon-green/10 border border-neon-green/20 px-3 py-1 rounded-full whitespace-nowrap">
                  {edu.grade}
                </span>
              )}
            </div>
          </div>

          {/* Detailed Narrative / Description */}
          {edu.description && edu.description.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2.5">
              {edu.description.map((para, i) => (
                <p key={i} className="text-base sm:text-[17px] text-text-secondary leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* Activities */}
          {edu.activities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-xs sm:text-sm font-mono font-semibold text-cyan uppercase tracking-wider mb-3">
                Activities and Societies
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {edu.activities.map((a) => (
                  <div key={a} className="flex items-start gap-2.5 text-base sm:text-[17px] text-text-secondary">
                    <span
                      className="flex-shrink-0 mt-[8px] w-2 h-2 rounded-full"
                      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                    />
                    <span className="leading-relaxed">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Competencies */}
          {edu.skills && edu.skills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-xs font-mono font-semibold text-cyan uppercase tracking-wider mb-2.5">
                Skills &amp; Competencies
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {edu.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-text-secondary hover:text-text-primary hover:border-white/[0.2] transition-colors"
                  >
                    {skill}
                  </span>
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
    title: 'Kilobots Robotics Club',
    org: 'Government College of Engineering, Kalahandi',
    role: 'Member',
    color: '#00E5FF',
    details: [
      'Contributing to team-based innovation in automation and embedded systems',
      'Worked with microcontrollers, sensors, and hardware-software integration',
      'Collaborated on competitive robotics and autonomous systems challenges',
    ],
  },
  {
    icon: Trophy,
    title: 'Ashoka House Sports Captain',
    org: 'Kendriya Vidyalaya',
    role: 'Sports Captain',
    color: '#00FF87',
    details: [
      'Served as Sports Captain of Ashoka House, leading in athletics and inter-house events',
      'Demonstrated strong team management, discipline, and motivational leadership',
      'Organized house participation across sports, athletic track events, and tournaments',
    ],
  },
  {
    icon: Code2,
    title: 'Tech-Fest & Cultural Event Volunteer',
    org: 'GCE Kalahandi & KV',
    role: 'Event Coordinator & Volunteer',
    color: '#7C3AED',
    details: [
      'Active participant and organizer in college Tech-fests promoting innovation and learning',
      'Volunteered in multiple college-level functions, cultural events, and tech fests',
      'Took up coordination roles and logistical event support responsibilities',
    ],
  },
  {
    icon: Users,
    title: 'Competitive Sports & Gaming',
    org: 'Athletics, Chess, Cricket, Football & Gaming',
    role: 'Club & Competitive Player',
    color: '#FF2D9C',
    details: [
      'Actively participated in athletics and college-level sports competitions',
      'Strategic chess player with passion for competitive tournaments',
      'Club-level cricket player and school football team player',
      'Pro Higher Gaming Gamer active in competitive gaming and strategic gameplay',
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
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="section-header"
          >
            <p className="section-label">05 / Education</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Academic <span className="text-gradient">Background</span>
              </h2>
            </Dynamic3DText>
            <p className="section-subtitle">
              My formal education, extracurricular leadership, and active involvement in technical communities.
            </p>
          </motion.div>

          {/* ── Education (full-width) ── */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-12 mb-8"
          >
            <GraduationCap size={18} className="text-violet" />
            <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary text-3d-interactive">Education</h3>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gradient-to-b from-violet/40 via-neon-pink/20 to-transparent" />
            <div className="space-y-6">
              {education.map((edu, i) => (
                <EducationCard key={`${edu.institution}-${edu.degree}`} edu={edu} index={i} />
              ))}
            </div>
          </div>

          {/* ── Clubs & Activities ── */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-16 mb-8"
          >
            <Award size={18} className="text-neon-orange" />
            <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary text-3d-interactive">Clubs &amp; Activities</h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clubsData.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <Dynamic3DCard intensity={12} depth={18} glowColor={`${item.color}30`} className="h-full">
                    <div className="relative glass-card p-5 sm:p-6 flex flex-col gap-4 overflow-hidden group h-full justify-between">
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
                          className="text-xs sm:text-sm font-mono font-medium px-3 py-1 rounded-full"
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
                        <h4 className="text-xl sm:text-2xl font-display font-bold text-text-primary leading-tight text-3d-interactive">{item.title}</h4>
                        <p className="text-base sm:text-lg font-semibold text-text-secondary mt-1">{item.org}</p>
                      </div>

                      {/* Detail bullets */}
                      <ul className="space-y-2.5 mt-auto pt-2">
                        {item.details.map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-base sm:text-[17px] text-text-secondary leading-relaxed">
                            <span
                              className="flex-shrink-0 mt-[8px] w-2 h-2 rounded-full"
                              style={{ background: item.color }}
                            />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Dynamic3DCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
