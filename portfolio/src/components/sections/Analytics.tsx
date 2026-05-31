'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks'
import { certifications, githubStats } from '@/data/portfolio'
import { ExternalLink, Award } from 'lucide-react'
import CountUp from 'react-countup'

export default function Analytics() {
  const { ref, inView } = useInView(0.1)

  const categoryColors: Record<string, string> = {
    ai_ml: '#00E5FF',
    cloud: '#00FF87',
    data: '#FFE500',
    development: '#7C3AED',
    other: '#FF6B2B',
  }

  return (
    <div className="py-10 sm:py-14 md:py-20">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-header"
          >
            <p className="section-label">07 / Analytics & Certifications</p>
            <h2 className="section-title">
              Verified <span className="text-gradient">Credentials</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {/* Certifications */}
            <div>
              <h3 className="font-display font-semibold text-text-primary mb-6 flex items-center gap-2">
                <Award size={18} className="text-cyan" />
                Certifications
              </h3>

              <div className="space-y-4">
                {certifications.map((cert, i) => {
                  const color = categoryColors[cert.category] || '#00E5FF'
                  return (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 flex items-start gap-4"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                      >
                        🏆
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-text-primary leading-tight">{cert.title}</h4>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-text-secondary hover:text-cyan transition-colors flex-shrink-0"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">{cert.issuer}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-mono text-text-secondary">{cert.date}</span>
                          {cert.credentialId && (
                            <span className="text-xs font-mono text-text-tertiary">· {cert.credentialId}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cert.skills.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="text-xs px-2 py-0.5 rounded-md font-mono"
                              style={{ background: `${color}08`, color, border: `1px solid ${color}18` }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Analytics */}
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-text-primary flex items-center gap-2">
                <span>📊</span>
                Code Analytics
              </h3>

              {/* Metric grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Commits', value: githubStats.totalCommits, color: '#00E5FF', suffix: '' },
                  { label: 'Public Repos', value: githubStats.publicRepos, color: '#7C3AED', suffix: '' },
                  { label: 'GitHub Stars', value: githubStats.totalStars, color: '#FFE500', suffix: '' },
                  { label: 'Day Streak', value: githubStats.contributionStreak, color: '#00FF87', suffix: ' days' },
                ].map((m) => (
                  <div key={m.label} className="glass-card p-5 text-center">
                    <div
                      className="font-display font-bold text-3xl"
                      style={{ color: m.color }}
                    >
                      {inView && <CountUp end={m.value} duration={2} separator="," />}
                      {m.suffix}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Language breakdown */}
              <div className="glass-card p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-4">Language Distribution</h4>
                <div className="space-y-3">
                  {githubStats.topLanguages.map((lang, i) => (
                    <div key={lang.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: lang.color }} />
                      <span className="text-sm text-text-primary w-20 sm:w-28 flex-shrink-0">{lang.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={inView ? { scaleX: lang.percentage / 100 } : {}}
                          transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: [0.19, 1, 0.22, 1] }}
                          className="h-full rounded-full origin-left"
                          style={{ background: lang.color }}
                        />
                      </div>
                      <span className="text-xs font-mono text-text-secondary w-8 text-right">
                        {lang.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

