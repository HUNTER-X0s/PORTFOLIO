'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks'
import { skillGroups } from '@/data/portfolio'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { skillLevelLabel, cn } from '@/lib/utils'
import type { SkillCategory } from '@/types'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

function SkillBar({ name, level, color, index, inView }: {
  name: string; level: number; color: string; index: number; inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="group p-2 rounded-xl hover:bg-white/[0.03] transition-colors"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-text-primary group-hover:text-cyan transition-colors text-3d-interactive">
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
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Technical <span className="text-gradient">Arsenal</span>
              </h2>
            </Dynamic3DText>
            <p className="text-text-secondary mt-3 max-w-xl">
              A full-spectrum skill set spanning frontend, backend, AI/ML, and cloud — built through real internships and shipped projects.
            </p>
          </motion.div>

          {/* Overview / Category selector cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 mb-7 sm:mb-10"
          >
            {overallStats.map((stat, i) => {
              const isActive = activeCategory === skillGroups[i].category
              return (
                <Dynamic3DCard
                  key={stat.label}
                  intensity={16}
                  depth={20}
                  glowColor={`${stat.color}35`}
                  onClick={() => setActiveCategory(skillGroups[i].category)}
                  className="cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.08 * i }}
                    className={cn(
                      'glass-card p-3 sm:p-5 text-center transition-all relative overflow-hidden group h-full flex flex-col justify-between',
                      isActive
                        ? 'border-opacity-60'
                        : 'hover:border-white/[0.22]'
                    )}
                    style={isActive ? {
                      borderColor: `${stat.color}70`,
                      boxShadow: `0 0 28px ${stat.color}25, inset 0 0 16px ${stat.color}10`,
                      background: `linear-gradient(180deg, ${stat.color}18 0%, rgba(255,255,255,0.03) 100%)`,
                    } : {}}
                  >
                    {/* Active top accent indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSkillCategoryGlow"
                        className="absolute top-0 left-0 right-0 h-[2.5px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                      />
                    )}
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-115 transition-transform duration-200">
                      {stat.icon}
                    </div>
                    <div
                      className="text-base sm:text-2xl font-display font-bold text-3d-interactive"
                      style={{ color: stat.color }}
                    >
                      {stat.avg}%
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-text-primary mt-0.5 truncate">
                      {stat.label}
                    </div>
                    <div className="text-[10px] text-text-secondary font-mono mt-0.5 opacity-70">
                      {skillGroups[i].skills.length} skills
                    </div>
                  </motion.div>
                </Dynamic3DCard>
              )
            })}
          </motion.div>

          {/* Full-Width Skill bars panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
          >
            <Dynamic3DCard intensity={8} depth={15} glowColor={`${activeGroup.color}20`}>
              <div className="glass-card p-4 sm:p-6 lg:p-8 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: `${activeGroup.color}15`, border: `1px solid ${activeGroup.color}25` }}
                    >
                      {activeGroup.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                        {activeGroup.label}
                      </h3>
                      <p className="text-xs text-text-secondary font-mono">
                        {activeGroup.skills.length} technologies tracked · Average proficiency: {overallStats.find(s => s.label === activeGroup.label)?.avg}%
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-mono px-3 py-1.5 rounded-full border"
                    style={{
                      background: `${activeGroup.color}10`,
                      borderColor: `${activeGroup.color}30`,
                      color: activeGroup.color,
                    }}
                  >
                    Active Category
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 pt-2">
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
              </div>
            </Dynamic3DCard>
          </motion.div>

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
                  <motion.span
                    key={`${g.category}-${s.name}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-3 py-1.5 rounded-full font-mono text-text-secondary border border-white/[0.06] bg-white/[0.02] hover:border-cyan/30 hover:text-text-primary hover:shadow-[0_0_12px_rgba(0,229,255,0.25)] transition-all cursor-default select-none"
                  >
                    {s.name}
                  </motion.span>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

