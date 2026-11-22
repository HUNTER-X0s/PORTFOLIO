'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks'
import { blogPosts } from '@/data/portfolio'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

export default function Blog() {
  const { ref, inView } = useInView(0.05)

  return (
    <div className="py-10 sm:py-14 md:py-20">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="section-header"
          >
            <p className="section-label">08 / Blog & Writing</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Sharing <span className="text-gradient">Knowledge</span>
              </h2>
            </Dynamic3DText>
            <p className="section-subtitle">
              Technical deep-dives on AI, full-stack engineering, and lessons learned from real projects.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <Dynamic3DCard intensity={14} depth={20} glowColor="rgba(0, 229, 255, 0.25)" className="h-full">
                  <div className="glass-card p-5 sm:p-6 flex flex-col group cursor-pointer hover:border-cyan/40 transition-all h-full justify-between space-y-4">
                    <div>
                      {/* Category & Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs sm:text-sm font-mono font-medium text-cyan px-2.5 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                          {post.category}
                        </span>
                        {post.featured && (
                          <span className="text-xs sm:text-sm font-mono font-medium text-neon-orange px-2.5 py-1 rounded-full bg-neon-orange/10 border border-neon-orange/20">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary leading-tight mb-2.5 group-hover:text-cyan transition-colors text-3d-interactive">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-text-secondary text-base sm:text-[17px] leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs sm:text-sm px-3 py-1 rounded-full font-mono text-text-secondary border border-white/[0.08] bg-white/[0.03] flex items-center gap-1.5"
                          >
                            <Tag size={11} />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-text-secondary pt-3.5 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} />
                          <span>{post.readTime}</span>
                          <span>·</span>
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-cyan font-mono font-medium transition-all group-hover:gap-1.5">
                          Read
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Dynamic3DCard>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="text-center mt-10"
          >
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl mx-auto glass border border-white/[0.09] text-text-secondary hover:text-text-primary hover:border-cyan/30 transition-all text-sm sm:text-base font-semibold btn-3d">
              View All Articles
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

