'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useInView } from '@/hooks'
import { MapPin, Mail, BookOpen, Code2, Cpu } from 'lucide-react'
import { personalInfo } from '@/data/portfolio'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
}

export default function About() {
  const { ref, inView } = useInView(0.05)

  return (
    <div className="py-10 sm:py-14 md:py-20">
      <div className="section-container">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="section-header">
            <p className="section-label">01 / About</p>
            <Dynamic3DText intensity={10} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Who <span className="text-gradient">I Am</span>
              </h2>
            </Dynamic3DText>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Left — Bio */}
            <div className="space-y-6">
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/[0.1] shadow-2xl relative">
                  <Image
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 128px, 160px"
                    loading="lazy"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="text-center sm:text-left flex-1 pt-2">
                  <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                    {personalInfo.name}
                  </h3>
                  <p className="text-sm font-mono text-cyan uppercase tracking-widest mb-3">
                    {personalInfo.title}
                  </p>
                  <p className="text-text-secondary leading-relaxed text-sm">
                    {personalInfo.shortBio}
                  </p>
                </div>
              </motion.div>

              <motion.p variants={itemVariants} className="text-text-secondary text-base sm:text-lg leading-relaxed">
                I&apos;m{' '}
                <span className="text-text-primary font-semibold">{personalInfo.name}</span>, a
                final-year{' '}
                <span className="text-cyan font-medium">B.Tech Computer Science</span> student at{' '}
                <span className="text-text-primary font-medium">
                  Government College of Engineering, Kalahandi (GCEK)
                </span>
                , Odisha.
              </motion.p>

              <motion.p variants={itemVariants} className="text-text-secondary leading-relaxed">
                I build things at the intersection of{' '}
                <span className="text-violet font-medium">AI engineering</span> and{' '}
                <span className="text-neon-orange font-medium">full-stack development</span> — from
                RAG-powered chatbots and ML forecasting systems to responsive web platforms with
                cinematic UX. I care deeply about the craft: clean architecture, scalable code,
                and experiences that feel like magic to users.
              </motion.p>

              <motion.p variants={itemVariants} className="text-text-secondary leading-relaxed">
                I&apos;ve completed AI, web, and data-focused internships, shipped production applications, and lead the
                AI/ML division of my college tech club. I&apos;m currently seeking{' '}
                <span className="text-cyan font-medium">SDE / AI / ML roles</span> where I can work
                at the boundary of engineering and intelligence.
              </motion.p>

              {/* Quick facts */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { icon: MapPin, label: 'Location', value: personalInfo.location, color: '#00E5FF' },
                  { icon: Mail, label: 'Email', value: personalInfo.email, color: '#7C3AED' },
                  { icon: BookOpen, label: 'Degree', value: 'B.Tech CS — GCEK', color: '#FF6B2B' },
                  { icon: Code2, label: 'Open to', value: 'SDE · AI · ML Roles', color: '#00FF87' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <Dynamic3DCard key={label} intensity={12} depth={15} glowColor={`${color}30`}>
                    <div className="glass-card flex items-center gap-3 p-3.5 h-full">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                      >
                        <Icon size={15} style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-text-secondary">{label}</p>
                        <p className="text-sm font-medium text-text-primary truncate">{value}</p>
                      </div>
                    </div>
                  </Dynamic3DCard>
                ))}
              </motion.div>
            </div>

            {/* Right — Highlights */}
            <div className="space-y-5">
              {/* Currently doing */}
              <motion.div variants={itemVariants}>
                <Dynamic3DCard intensity={10} depth={18} glowColor="rgba(0, 229, 255, 0.2)">
                  <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-cyan" />
                      <h3 className="font-display font-semibold text-text-primary">Current Focus</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          title: 'B.Tech Final Year',
                          desc: 'Computer Science @ GCEK · CGPA 8.10/10',
                          badge: '2025',
                          color: '#00E5FF',
                        },
                        {
                          title: 'Core Lead — AI/ML Club',
                          desc: 'Leading 12-member team, organizing workshops & hackathons',
                          badge: 'Present',
                          color: '#7C3AED',
                        },
                        {
                          title: 'Open Source',
                          desc: '42 public repos · 234 stars · 1,847 commits',
                          badge: 'Active',
                          color: '#00FF87',
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.12] transition-colors"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-text-primary">{item.title}</span>
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-mono"
                                style={{
                                  background: `${item.color}15`,
                                  border: `1px solid ${item.color}25`,
                                  color: item.color,
                                }}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Dynamic3DCard>
              </motion.div>

              {/* Languages & Hobbies */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <Dynamic3DCard intensity={12} depth={16} glowColor="rgba(124, 58, 237, 0.2)">
                  <div className="glass-card p-4 sm:p-5 h-full">
                    <p className="text-xs font-mono text-text-secondary mb-3 uppercase tracking-widest">
                      Languages
                    </p>
                    <div className="space-y-2.5">
                      {personalInfo.languages.map((lang) => (
                        <div key={lang.language} className="lang-row">
                          <span className="lang-name">{lang.language}</span>
                          <span className="lang-badge">
                            {lang.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Dynamic3DCard>

                <Dynamic3DCard intensity={12} depth={16} glowColor="rgba(0, 255, 135, 0.2)">
                  <div className="glass-card p-4 sm:p-5 h-full">
                    <p className="text-xs font-mono text-text-secondary mb-3 uppercase tracking-widest">
                      Beyond Code
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {personalInfo.hobbies.map((hobby) => (
                        <span
                          key={hobby}
                          className="text-xs px-2.5 py-1 rounded-full text-text-secondary border border-white/[0.06] bg-white/[0.02] hover:border-cyan/30 hover:text-text-primary hover:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all cursor-default"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                </Dynamic3DCard>
              </motion.div>

              {/* Tagline */}
              <motion.div variants={itemVariants}>
                <Dynamic3DCard intensity={14} depth={20} glowColor="rgba(0, 229, 255, 0.25)">
                  <div className="glass-card p-5 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at center, #00E5FF, transparent 70%)' }} />
                    <p className="font-display text-xl font-bold text-gradient relative z-10 text-3d-interactive">
                      &ldquo;{personalInfo.tagline}&rdquo;
                    </p>
                  </div>
                </Dynamic3DCard>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

