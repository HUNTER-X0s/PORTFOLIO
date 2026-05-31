'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { roleContents, roles } from '@/data/portfolio'
import { CheckCircle2, Zap } from 'lucide-react'

export default function ValueProp() {
  const { ref, inView } = useInView(0.2)
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const content = roleContents[activeRole] || roleContents['fullstack']
  const currentRole = roles.find((r) => r.id === activeRole) || roles.find((r) => r.id === 'fullstack') || roles[0]

  return (
    <div className="py-10 sm:py-14 md:py-20">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-header"
          >
            <p className="section-label">06 / Why Hire Me</p>
            <h2 className="section-title">
              The Value I <span className="text-gradient">Bring</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start">
            {/* Left — Dynamic value prop */}
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="space-y-5"
            >
              <div className="glass-card p-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-5"
                  style={{ background: `radial-gradient(circle at top left, ${currentRole.color}, transparent 60%)` }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="text-2xl">{currentRole.icon}</span>
                    <h3 className="font-display font-bold text-xl text-text-primary">
                      {content.whyHireMe.title}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {content.whyHireMe.points.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: currentRole.color }}
                        />
                        <p className="text-text-secondary text-sm leading-relaxed">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs font-mono text-text-secondary text-center">
                ↑ Updates dynamically based on role selected in navbar
              </p>
            </motion.div>

            {/* Right — All roles grid */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-4">
                Strong across all these roles
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {roles.map((role, i) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.05 + 0.3 }}
                    className="glass-card p-3.5 text-center hover:border-opacity-40 transition-all"
                    style={activeRole === role.id ? {
                      borderColor: `${role.color}40`,
                      boxShadow: `0 0 16px ${role.color}12`,
                    } : {}}
                  >
                    <div className="text-xl mb-1.5">{role.icon}</div>
                    <div className="text-xs font-medium text-text-primary leading-tight">{role.shortLabel}</div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="mt-6 glass-card p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                  <Zap size={18} className="text-cyan" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Ready to make an impact from Day 1
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Production-proven, fast learner, strong communicator
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

