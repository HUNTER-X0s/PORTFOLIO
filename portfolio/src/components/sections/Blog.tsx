'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks'
import { blogPosts } from '@/data/portfolio'
import { ArrowRight, Clock, Tag } from 'lucide-react'

export default function Blog() {
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
            <p className="section-label">08 / Blog & Writing</p>
            <h2 className="section-title">
              Sharing <span className="text-gradient">Knowledge</span>
            </h2>
            <p className="text-text-secondary mt-3 max-w-xl">
              Technical deep-dives on AI, full-stack engineering, and lessons learned from real projects.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="glass-card p-6 flex flex-col group cursor-pointer hover:border-cyan/20 transition-all"
              >
                {/* Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-cyan px-2.5 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="text-xs font-mono text-neon-orange px-2 py-0.5 rounded-full bg-neon-orange/10 border border-neon-orange/20">
                      Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-text-primary leading-snug mb-3 group-hover:text-cyan transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-4">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded font-mono text-text-secondary border border-white/[0.06] bg-white/[0.02] flex items-center gap-1"
                    >
                      <Tag size={9} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} />
                    <span>{post.readTime}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1 group-hover:text-cyan transition-colors group-hover:gap-2">
                    Read
                    <ArrowRight size={12} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center mt-10"
          >
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl mx-auto glass border border-white/[0.09] text-text-secondary hover:text-text-primary hover:border-cyan/20 transition-all text-sm font-medium">
              View All Articles
              <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
