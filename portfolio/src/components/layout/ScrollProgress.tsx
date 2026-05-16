'use client'

import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks'

export default function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <>
      {/* Top bar (handled in Navbar) */}

      {/* Side indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-1.5">
        {['hero','about','skills','projects','experience','github','value','analytics','blog','contact'].map((id, i) => {
          const sectionProgress = Math.max(0, Math.min(1, (progress * 10) - i))
          return (
            <motion.button
              key={id}
              onClick={() => {
                const el = document.getElementById(id)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="relative group"
              title={id}
            >
              <div
                className="w-1 h-1 rounded-full transition-all duration-300"
                style={{
                  background: sectionProgress > 0.3 ? '#00E5FF' : 'rgba(255,255,255,0.15)',
                  transform: `scale(${sectionProgress > 0.3 ? 1.4 : 1})`,
                  boxShadow: sectionProgress > 0.3 ? '0 0 6px rgba(0,229,255,0.6)' : 'none',
                }}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-mono text-text-secondary bg-surface-3 border border-glass-border px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none capitalize">
                {id}
              </span>
            </motion.button>
          )
        })}
      </div>
    </>
  )
}
