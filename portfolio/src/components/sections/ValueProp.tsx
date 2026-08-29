'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { roleContents, roles } from '@/data/portfolio'
import { CheckCircle2, Zap } from 'lucide-react'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

export default function ValueProp() {
  const { ref, inView } = useInView(0.2)
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const setActiveRole = usePortfolioStore((s) => s.setActiveRole)
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
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                The Value I <span className="text-gradient">Bring</span>
              </h2>
            </Dynamic3DText>
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
              <Dynamic3DCard intensity={12} depth={20} glowColor={`${currentRole.color}30`}>
                <div className="glass-card p-6 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{ background: `radial-gradient(circle at top left, ${currentRole.color}, transparent 60%)` }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-5">
                      <span className="text-2xl">{currentRole.icon}</span>
                      <h3 className="font-display font-bold text-xl text-text-primary text-3d-interactive">
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
              </Dynamic3DCard>

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
                  <Dynamic3DCard
                    key={role.id}
                    intensity={15}
                    depth={16}
                    glowColor={`${role.color}25`}
                    onClick={() => setActiveRole(role.id)}
                    className="cursor-pointer"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: i * 0.05 + 0.3 }}
                      className="glass-card p-3.5 text-center hover:border-opacity-60 transition-all h-full"
                      style={activeRole === role.id ? {
                        borderColor: `${role.color}60`,
                        boxShadow: `0 0 16px ${role.color}20`,
                        background: `linear-gradient(180deg, ${role.color}15 0%, rgba(255,255,255,0.02) 100%)`,
                      } : {}}
                    >
                      <div className="text-xl mb-1.5">{role.icon}</div>
                      <div className="text-xs font-medium text-text-primary leading-tight text-3d-interactive">{role.shortLabel}</div>
                      <div className="text-[10px] text-text-secondary font-mono mt-1 opacity-70">
                        {role.description}
                      </div>
                    </motion.div>
                  </Dynamic3DCard>
                ))}
              </div>

              {/* Bottom CTA block */}
              <div className="mt-6">
                <Dynamic3DCard intensity={10} depth={15} glowColor="rgba(0, 229, 255, 0.2)">
                  <div className="glass-card p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-text-primary text-3d-interactive">Ready to make an impact from Day 1</p>
                      <p className="text-xs text-text-secondary mt-0.5">Production-proven, fast learner, strong communicator</p>
                    </div>
                    <a
                      href="#contact"
                      className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-cyan border border-cyan/30 glass hover:bg-cyan/10 transition-all btn-3d"
                    >
                      Get in Touch →
                    </a>
                  </div>
                </Dynamic3DCard>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

