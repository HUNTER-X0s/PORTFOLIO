'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks'
import { githubStats } from '@/data/portfolio'
import { Github, Star, GitFork, GitCommit, Users, ExternalLink } from 'lucide-react'
import GitHubCalendar from 'react-github-calendar'
import CountUp from 'react-countup'

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: any; color: string
}) {
  const { ref, inView } = useInView(0.3)
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="glass-card p-5 text-center"
    >
      <div
        className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
        style={{ background: `${color}12`, border: `1px solid ${color}25` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="font-display font-bold text-2xl text-text-primary">
        {inView ? <CountUp end={value} duration={2} separator="," /> : '0'}
        {value > 999 && !label.includes('Repos') ? '+' : ''}
      </div>
      <div className="text-xs text-text-secondary mt-1">{label}</div>
    </div>
  )
}

export default function GitHub() {
  const { ref, inView } = useInView(0.1)

  return (
    <div className="py-16 sm:py-24 md:py-32">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-header"
          >
            <p className="section-label">05 / GitHub</p>
            <h2 className="section-title">
              Open Source <span className="text-gradient">Activity</span>
            </h2>
            <p className="text-text-secondary mt-3">
              Real-time code activity — shipped consistently, not just for show.
            </p>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-10"
          >
            <StatCard label="Public Repos" value={githubStats.publicRepos} icon={Github} color="#00E5FF" />
            <StatCard label="Total Stars" value={githubStats.totalStars} icon={Star} color="#FFE500" />
            <StatCard label="Total Forks" value={githubStats.totalForks} icon={GitFork} color="#7C3AED" />
            <StatCard label="Commits" value={githubStats.totalCommits} icon={GitCommit} color="#00FF87" />
            <StatCard label="Followers" value={githubStats.followers} icon={Users} color="#FF6B2B" />
          </motion.div>

          {/* Languages + Streak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-10">
            {/* Top Languages */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-display font-semibold text-text-primary mb-5">Top Languages</h3>

              {/* Bar chart */}
              <div className="flex rounded-lg overflow-hidden h-3 mb-5">
                {githubStats.topLanguages.map((lang) => (
                  <div
                    key={lang.name}
                    style={{ width: `${lang.percentage}%`, background: lang.color }}
                    title={`${lang.name}: ${lang.percentage}%`}
                    className="transition-all hover:brightness-125"
                  />
                ))}
              </div>

              <div className="space-y-3">
                {githubStats.topLanguages.map((lang, i) => (
                  <div key={lang.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: lang.color }}
                      />
                      <span className="text-sm text-text-primary">{lang.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={inView ? { scaleX: lang.percentage / 100 } : {}}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                          className="h-full rounded-full origin-left"
                          style={{ background: lang.color }}
                        />
                      </div>
                      <span className="text-xs font-mono text-text-secondary w-8 text-right">
                        {lang.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Streak & profile */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="space-y-4"
            >
              {/* Streak */}
              <div className="glass-card p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at center, #FF6B2B, transparent 70%)' }} />
                <div className="relative z-10">
                  <div className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3">
                    Current Streak
                  </div>
                  <div className="font-display font-bold text-5xl text-neon-orange">
                    {githubStats.contributionStreak}
                  </div>
                  <div className="text-text-secondary text-sm mt-1">days consecutive</div>
                </div>
              </div>

              {/* GitHub profile link */}
              <a
                href={githubStats.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 flex items-center justify-between group hover:border-cyan/20 transition-all block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                    <Github size={20} className="text-text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      @{githubStats.username}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {githubStats.publicRepos} repos · {githubStats.followers} followers
                    </div>
                  </div>
                </div>
                <ExternalLink size={16} className="text-text-secondary group-hover:text-cyan transition-colors" />
              </a>
            </motion.div>
          </div>

          {/* GitHub Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-text-primary mb-5">
              Contribution Graph
            </h3>
            <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pb-2">
              <GitHubCalendar
                username={githubStats.username}
                colorScheme="dark"
                fontSize={12}
                blockSize={12}
                blockMargin={4}
                theme={{
                  dark: ['#0F0F22', '#002B33', '#005566', '#008099', '#00E5FF'],
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
