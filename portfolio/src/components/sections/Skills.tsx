'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks'
import { skillGroups } from '@/data/portfolio'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { skillLevelLabel, cn } from '@/lib/utils'
import type { SkillCategory } from '@/types'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

function SkillBar({ name, level, color, index }: {
  name: string; level: number; color: string; index: number
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      className="group p-2 rounded-xl hover:bg-white/[0.04] transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-base sm:text-lg font-semibold text-text-primary group-hover:text-cyan transition-colors text-3d-interactive">
          {name}
        </span>
        <div className="flex items-center gap-2.5">
          <span className="text-sm sm:text-base font-mono font-semibold text-text-secondary">{level}%</span>
          <span
            className="text-xs sm:text-sm px-2.5 py-0.5 rounded-full font-mono font-medium"
            style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
          >
            {skillLevelLabel(level)}
          </span>
        </div>
      </div>

      <div className="skill-bar-track h-2 sm:h-2.5">
        <motion.div
          className="skill-bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: level / 100 }}
          transition={{ delay: index * 0.04 + 0.1, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}, #7C3AED)` }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const { ref, inView } = useInView(0.05)
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('languages')

  // Auto-sync category when activeRole changes
  useEffect(() => {
    const roleCategoryMap: Record<string, SkillCategory> = {
      fullstack: 'web_dev',
      ai_engineer: 'agentic_ai',
      devops: 'cloud_devops',
      networking: 'networking',
      cybersecurity: 'cybersecurity',
      ml_engineer: 'ai_ml',
      dl_engineer: 'ai_ml',
      cloud: 'cloud_devops',
      data_scientist: 'python_stack',
      data_analyst: 'visualization',
      frontend: 'web_dev',
      backend: 'languages',
    }
    if (activeRole && roleCategoryMap[activeRole]) {
      setActiveCategory(roleCategoryMap[activeRole])
    }
  }, [activeRole])

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
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="section-header"
          >
            <p className="section-label">02 / Skills</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Technical <span className="text-gradient">Arsenal</span>
              </h2>
            </Dynamic3DText>
            <p className="section-subtitle">
              A comprehensive technical arsenal spanning 16 specialized domains — from AI/ML, Generative AI, and Agentic AI to Cloud, DevOps, Networking, and Cybersecurity.
            </p>
          </motion.div>

          {/* Overview / Category selector cards — 16 categories in clean 8-col grid */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5 mb-7 sm:mb-10"
          >
            {overallStats.map((stat, i) => {
              const isActive = activeCategory === skillGroups[i].category
              return (
                <Dynamic3DCard
                  key={stat.label}
                  intensity={14}
                  depth={16}
                  glowColor={`${stat.color}35`}
                  onClick={() => setActiveCategory(skillGroups[i].category)}
                  className="cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    title={stat.label}
                    className={cn(
                      'glass-card p-2 sm:p-2.5 lg:p-3 text-center transition-all relative overflow-hidden group h-full flex flex-col justify-between min-h-[110px] sm:min-h-[120px]',
                      isActive
                        ? 'border-opacity-60'
                        : 'hover:border-white/[0.22]'
                    )}
                    style={isActive ? {
                      borderColor: `${stat.color}70`,
                      boxShadow: `0 0 24px ${stat.color}25, inset 0 0 14px ${stat.color}10`,
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
                    <div className="text-xl sm:text-2xl mb-1 group-hover:scale-115 transition-transform duration-200">
                      {stat.icon}
                    </div>
                    <div
                      className="text-base sm:text-xl font-display font-bold text-3d-interactive"
                      style={{ color: stat.color }}
                    >
                      {stat.avg}%
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-text-primary mt-1 line-clamp-2 leading-tight">
                      {stat.label}
                    </div>
                    <div className="text-xs text-text-secondary font-mono mt-0.5">
                      {skillGroups[i].skills.length} skills
                    </div>
                  </motion.div>
                </Dynamic3DCard>
              )
            })}
          </motion.div>

          {/* Full-Width Skill bars panel */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
          >
            <Dynamic3DCard intensity={8} depth={15} glowColor={`${activeGroup.color}20`}>
              <div className="glass-card p-4 sm:p-6 lg:p-8 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl sm:text-3xl"
                      style={{ background: `${activeGroup.color}15`, border: `1px solid ${activeGroup.color}25` }}
                    >
                      {activeGroup.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary">
                        {activeGroup.label}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-secondary font-mono mt-0.5">
                        {activeGroup.skills.length} technologies tracked · Average proficiency: {overallStats.find(s => s.label === activeGroup.label)?.avg}%
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-mono px-2.5 py-1 rounded-full border font-medium"
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
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <p className="text-sm sm:text-base font-mono text-cyan uppercase tracking-widest mb-3.5 font-semibold">
              Full Technology List
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {skillGroups.flatMap((g) =>
                g.skills.map((s) => (
                  <motion.span
                    key={`${g.category}-${s.name}`}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs sm:text-sm px-3 py-1.5 rounded-full font-mono font-medium text-text-secondary border border-white/[0.08] bg-white/[0.02] hover:border-cyan/40 hover:text-text-primary hover:shadow-[0_0_12px_rgba(0,229,255,0.25)] transition-all cursor-default select-none"
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

