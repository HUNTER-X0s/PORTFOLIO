'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink, Award, Filter, ChevronDown, ChevronUp,
  CheckCircle2, Calendar, Hash, Download, Eye
} from 'lucide-react'
import { useInView } from '@/hooks'
import {
  certifications, certCategoryMeta, getFeaturedCerts,
  getCertsByCategory, getCertsByRole,
  type CertCategory, type Certification
} from '@/data/certifications'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { cn } from '@/lib/utils'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

// ── Category filter tabs ───────────────────────────────────
const CATEGORY_FILTERS: { key: 'all' | CertCategory; label: string; icon: string }[] = [
  { key: 'all',            label: 'All',           icon: '🏆' },
  { key: 'ai_ml',         label: 'AI / ML',       icon: '🤖' },
  { key: 'cloud',         label: 'Cloud',          icon: '☁️' },
  { key: 'web_development', label: 'Web Dev',     icon: '⚡' },
  { key: 'data_science',  label: 'Data Science',   icon: '📊' },
]

// ── Issuer logo with fallback ──────────────────────────────
function IssuerBadge({ cert }: { cert: Certification }) {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl font-bold"
      style={{
        background: `${cert.issuerColor}14`,
        border: `1.5px solid ${cert.issuerColor}35`,
        boxShadow: `0 0 12px ${cert.issuerColor}12`,
      }}
      title={cert.issuer}
    >
      {cert.badge}
    </div>
  )
}

// ── Single cert card ───────────────────────────────────────
function CertCard({ cert, index }: { cert: Certification; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const catMeta = certCategoryMeta[cert.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.25, delay: Math.min(index * 0.02, 0.1), ease: [0.19, 1, 0.22, 1] } }}
      className="h-full"
    >
      <Dynamic3DCard intensity={12} depth={16} glowColor={`${cert.issuerColor}25`} className="h-full">
        <div className="glass-card overflow-hidden group relative h-full">
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
            style={{ background: `linear-gradient(90deg, ${cert.issuerColor}, transparent 60%)` }}
          />

      <div className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-4">
        <div>
          {/* Header row */}
          <div className="flex items-start gap-3.5 mb-3">
            <IssuerBadge cert={cert} />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary leading-tight group-hover:text-cyan transition-colors text-3d-interactive">
                    {cert.title}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold mt-1" style={{ color: cert.issuerColor }}>
                    {cert.issuerShortName}
                  </p>
                </div>
                {cert.featured && (
                  <span className="text-xs sm:text-sm font-mono font-medium px-2.5 py-1 rounded-full flex-shrink-0 bg-cyan/10 border border-cyan/20 text-cyan">
                    Featured
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5 text-xs sm:text-sm text-text-secondary font-mono">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {cert.issueDate}
                </span>
                {cert.credentialId && (
                  <span className="flex items-center gap-1 text-text-tertiary">
                    <Hash size={13} />
                    {cert.credentialId.slice(0, 20)}
                  </span>
                )}
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-mono font-medium"
                  style={{ background: `${catMeta.color}10`, color: catMeta.color, border: `1px solid ${catMeta.color}20` }}
                >
                  {catMeta.icon} {catMeta.label}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-[17px] text-text-secondary leading-relaxed mt-2.5">
            {cert.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3.5">
            {cert.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="text-xs sm:text-sm px-3 py-1 rounded-full font-mono text-text-secondary border border-white/[0.08] bg-white/[0.03]"
              >
                {skill}
              </span>
            ))}
            {cert.skills.length > 5 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-mono text-text-tertiary border border-white/[0.06]">
                +{cert.skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Expandable project section */}
        {cert.linkedProject && (
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={12} style={{ color: cert.issuerColor }} />
                Project: {cert.linkedProject.name}
              </span>
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-3 p-3.5 rounded-xl"
                    style={{ background: `${cert.issuerColor}08`, border: `1px solid ${cert.issuerColor}18` }}
                  >
                    <p className="text-sm text-text-secondary leading-relaxed mb-2">
                      {cert.linkedProject.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {cert.linkedProject.techStack.slice(0, 5).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-md font-mono" style={{ background: `${cert.issuerColor}10`, color: cert.issuerColor }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: cert.issuerColor }}>
                      Impact: {cert.linkedProject.impact}
                    </p>
                    {cert.linkedProject.githubUrl && (
                      <a
                        href={cert.linkedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-mono text-cyan hover:underline"
                      >
                        <ExternalLink size={11} /> View on GitHub
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer CTA */}
        <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-white/[0.06]">
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all btn-3d"
            style={{
              background: `${cert.issuerColor}10`,
              border: `1px solid ${cert.issuerColor}25`,
              color: cert.issuerColor,
            }}
          >
            <Eye size={13} />
            View Credential
          </a>
          <a
            href={cert.fileUrl}
            download
            className="flex items-center justify-center p-2.5 rounded-xl glass border border-white/[0.09] text-text-secondary hover:text-text-primary hover:border-white/20 transition-all btn-3d"
            title="Download certificate"
          >
            <Download size={14} />
          </a>
        </div>
      </div>
        </div>
      </Dynamic3DCard>
    </motion.div>
  )
}

// ── Featured cert highlight strip ─────────────────────────
function FeaturedStrip() {
  const featured = getFeaturedCerts()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      {featured.map((cert) => (
        <Dynamic3DCard key={cert.id} intensity={14} depth={15} glowColor={`${cert.issuerColor}25`}>
          <div
            className="glass-card p-4 flex items-center gap-3 relative overflow-hidden h-full"
            style={{ borderColor: `${cert.issuerColor}30` }}
          >
            <div
              className="absolute top-0 left-0 bottom-0 w-1"
              style={{ background: cert.issuerColor }}
            />
            <span className="text-2xl flex-shrink-0">{cert.badge}</span>
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-semibold text-text-primary truncate text-3d-interactive">{cert.title}</p>
              <p className="text-xs sm:text-sm font-mono mt-0.5" style={{ color: cert.issuerColor }}>
                {cert.issuerShortName} · {cert.issueDate}
              </p>
            </div>
          </div>
        </Dynamic3DCard>
      ))}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function CertificationsSection() {
  const { ref, inView } = useInView(0.05)
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const [categoryFilter, setCategoryFilter] = useState<'all' | CertCategory>('all')
  const [showRoleFilter, setShowRoleFilter] = useState(false)

  const displayCerts = showRoleFilter
    ? getCertsByRole(activeRole)
    : categoryFilter === 'all'
    ? certifications
    : getCertsByCategory(categoryFilter)

  // Stats
  const totalCerts = certifications.length
  const aiMlCount = getCertsByCategory('ai_ml').length
  const uniqueIssuers = Array.from(new Set(certifications.map((c) => c.issuerShortName))).length

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
            <p className="section-label">07 / Certifications</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Verified <span className="text-gradient">Credentials</span>
              </h2>
            </Dynamic3DText>
            <p className="section-subtitle">
              {totalCerts} professional certificates from {uniqueIssuers} recognized organizations —
              including Infosys, IBM, and AICTE. All earned through active internships in 2025.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { label: 'Total Certs', value: totalCerts, color: '#00E5FF', icon: '🏆' },
              { label: 'AI / ML Certs', value: aiMlCount, color: '#FF2D9C', icon: '🤖' },
              { label: 'Organizations', value: uniqueIssuers, color: '#7C3AED', icon: '🏛️' },
              { label: 'Year Earned', value: 2025, color: '#00FF87', icon: '📅' },
            ].map((s) => (
              <Dynamic3DCard key={s.label} intensity={14} depth={15} glowColor={`${s.color}25`}>
                <div className="glass-card p-4 text-center h-full">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-display font-bold text-2xl text-3d-interactive" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-text-secondary font-mono mt-0.5">{s.label}</div>
                </div>
              </Dynamic3DCard>
            ))}
          </motion.div>

          {/* Featured strip */}
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-3">Top Credentials</p>
            <FeaturedStrip />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap"
          >
            <Filter size={13} className="text-text-secondary" />

            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setCategoryFilter(f.key); setShowRoleFilter(false) }}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all',
                  categoryFilter === f.key && !showRoleFilter
                    ? 'bg-cyan/12 border border-cyan/25 text-cyan font-semibold'
                    : 'text-text-secondary border border-white/[0.07] glass hover:text-text-primary hover:border-white/[0.14]'
                )}
              >
                <span>{f.icon}</span>
                {f.label}
                <span className="text-text-tertiary">
                  ({f.key === 'all' ? certifications.length : getCertsByCategory(f.key as CertCategory).length})
                </span>
              </button>
            ))}

            <div className="hidden sm:block h-4 w-px bg-white/[0.08]" />

            <button
              onClick={() => setShowRoleFilter(!showRoleFilter)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all',
                showRoleFilter
                  ? 'bg-violet-dim border border-violet/30 text-violet font-semibold'
                  : 'text-text-secondary border border-white/[0.07] glass hover:text-text-primary'
              )}
            >
              ✨ For My Role ({getCertsByRole(activeRole).length})
            </button>
          </motion.div>

          {/* Cert grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={categoryFilter + String(showRoleFilter)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {displayCerts.map((cert, i) => (
                <CertCard key={cert.id} cert={cert} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {displayCerts.length === 0 && (
            <div className="text-center py-16 text-text-secondary">
              <p>No certifications match this filter.</p>
              <button onClick={() => { setCategoryFilter('all'); setShowRoleFilter(false) }} className="mt-2 text-cyan text-sm hover:underline">
                Clear filter
              </button>
            </div>
          )}

          {/* GitHub link */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="text-center mt-10"
          >
            <a
              href="https://github.com/HUNTER-X0s/CERTIFICATIONS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/[0.09] text-text-secondary hover:text-text-primary hover:border-cyan/20 transition-all text-sm font-medium"
            >
              <Award size={15} />
              View All Certificates on GitHub
              <ExternalLink size={13} />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

