'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks'
import { skillGroups } from '@/data/portfolio'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { skillLevelLabel, cn } from '@/lib/utils'
import type { SkillCategory } from '@/types'

function SkillBar({ name, level, color, index, inView }: {
  name: string; level: number; color: string; index: number; inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-text-primary group-hover:text-cyan transition-colors">
          {name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-secondary">{level}%</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}
          >
            {skillLevelLabel(level)}
          </span>
        </div>
      </div>

      <div className="skill-bar-track">
        <motion.div
          className="skill-bar-fill"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: level / 100 } : { scaleX: 0 }}
          transition={{ delay: index * 0.06 + 0.2, duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}, #7C3AED)` }}
        />
      </div>
    </motion.div>
  )
}

function CategoryTab({ category, label, icon, color, isActive, onClick }: {
  category: SkillCategory; label: string; icon: string; color: string; isActive: boolean; onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
        isActive
          ? 'text-text-primary'
          : 'text-text-secondary hover:text-text-primary glass border border-white/[0.06] hover:border-white/[0.12]'
      )}
      style={isActive ? {
        background: `${color}14`,
        border: `1px solid ${color}30`,
        color: 'var(--text-1)',
        boxShadow: `0 0 20px ${color}15`,
      } : {}}
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{label}</span>
    </motion.button>
  )
}

export default function Skills() {
  const { ref, inView } = useInView(0.15)
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('frontend')

  const activeGroup = skillGroups.find((g) => g.category === activeCategory) || skillGroups[0]

  // Compute overall skill radar data
  const overallStats = skillGroups.map((g) => ({
    label: g.label,
    avg: Math.round(g.skills.reduce((sum, s) => sum + s.level, 0) / g.skills.length),
    color: g.color,
    icon: g.icon,
  }))

  return (
    <div className="py-10 sm:py-14 md:py-20">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <p className="section-label">02 / Skills</p>
            <h2 className="section-title">
              Technical <span className="text-gradient">Arsenal</span>
            </h2>
            <p className="text-text-secondary mt-3 max-w-xl">
              A full-spectrum skill set spanning frontend, backend, AI/ML, and cloud — built through real internships and shipped projects.
            </p>
          </motion.div>

          {/* Overview cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10"
          >
            {overallStats.map((stat, i) => (
              <motion.button
                key={stat.label}
                onClick={() => setActiveCategory(skillGroups[i].category)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i }}
                className={cn(
                  'glass-card p-4 text-center transition-all',
                  activeCategory === skillGroups[i].category && 'border-opacity-40'
                )}
                style={activeCategory === skillGroups[i].category ? {
                  borderColor: `${stat.color}40`,
                  boxShadow: `0 0 20px ${stat.color}12`,
                } : {}}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div
                  className="text-xl font-display font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.avg}%
                </div>
                <div className="text-xs text-text-secondary mt-1 truncate">{stat.label}</div>
              </motion.button>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-[auto_1fr] gap-8">
            {/* Category tabs — vertical on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:w-48 no-scrollbar snap-x snap-mandatory"
            >
              {skillGroups.map((group) => (
                <CategoryTab
                  key={group.category}
                  category={group.category}
                  label={group.label}
                  icon={group.icon}
                  color={group.color}
                  isActive={activeCategory === group.category}
                  onClick={() => setActiveCategory(group.category)}
                />
              ))}
            </motion.div>

            {/* Skill bars panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="glass-card p-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${activeGroup.color}15`, border: `1px solid ${activeGroup.color}25` }}
                    >
                      {activeGroup.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-text-primary">{activeGroup.label}</h3>
                      <p className="text-xs text-text-secondary font-mono">
                        {activeGroup.skills.length} technologies
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                    {activeGroup.skills.map((skill, i) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        color={activeGroup.color}
                        index={i}
                        inView={inView}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom strip — all tech tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            <p className="text-xs font-mono text-text-secondary mb-4 uppercase tracking-widest">
              Full technology list
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGroups.flatMap((g) =>
                g.skills.map((s) => (
                  <span
                    key={`${g.category}-${s.name}`}
                    className="text-xs px-3 py-1.5 rounded-full font-mono text-text-secondary border border-white/[0.06] bg-white/[0.02] hover:border-cyan/20 hover:text-text-primary transition-all cursor-default"
                  >
                    {s.name}
                  </span>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

