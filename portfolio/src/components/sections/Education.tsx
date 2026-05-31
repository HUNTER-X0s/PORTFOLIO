'use client'

import { motion } from 'framer-motion'
import { Calendar, GraduationCap, Award } from 'lucide-react'
import { useInView } from '@/hooks'
import { education } from '@/data/portfolio'
import { StaggerReveal, staggerItemLeft } from '@/components/animations/ScrollReveal'

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
            <h2 className="section-title">
              Academic <span className="text-gradient">Background</span>
            </h2>
            <p className="text-text-secondary mt-3 max-w-xl">
              My formal education, extracurricular leadership, and active involvement in technical communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 mt-12">
            {/* Education column */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-8">
                <GraduationCap size={16} className="text-violet" />
                <h3 className="font-display font-semibold text-text-primary">Education</h3>
              </motion.div>

              <div className="relative">
                <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gradient-to-b from-violet/40 via-neon-pink/20 to-transparent" />
                <StaggerReveal className="space-y-6">
                  {education.map((edu, i) => <EducationCard key={`${edu.institution}-${edu.degree}`} edu={edu} index={i} />)}
                </StaggerReveal>
              </div>
            </div>

            {/* Clubs & Activities column */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }}
                className="flex items-center gap-2 mb-8">
                <Award size={16} className="text-neon-orange" />
                <h3 className="font-display font-semibold text-text-primary">Clubs & Activities</h3>
              </motion.div>

              <StaggerReveal className="space-y-4" delay={0.1}>
                {[
                  { title: 'KiloBots Robotics Club', desc: 'Member · GCE Kalahandi — automation & embedded systems', color: '#00E5FF' },
                  { title: 'Ashoka House Sports Captain', desc: 'Kendriya Vidyalaya — led house in athletics & inter-house events', color: '#00FF87' },
                  { title: 'Tech-Fest Volunteer', desc: 'GCE Kalahandi — event organization and coordination', color: '#7C3AED' },
                ].map((item) => (
                  <motion.div key={item.title} variants={staggerItemLeft} className="flex items-start gap-3 p-4 rounded-xl glass border border-white/[0.06]">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                    <div>
                      <p className="text-base font-medium text-text-primary">{item.title}</p>
                      <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

