'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView, useSound } from '@/hooks'
import { personalInfo } from '@/data/portfolio'
import { Send, Mail, MapPin, Github, Linkedin, Twitter, CheckCircle2, Loader2 } from 'lucide-react'
import type { ContactForm } from '@/types'

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
}

export default function Contact() {
  const { ref, inView } = useInView(0.1)
  const { playClick } = useSound()
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playClick()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', company: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }

    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <div className="py-16 sm:py-24 md:py-32">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-header"
          >
            <p className="section-label">09 / Contact</p>
            <h2 className="section-title">
              Let&apos;s <span className="text-gradient">Build Together</span>
            </h2>
            <p className="text-text-secondary mt-3 max-w-xl">
              Open to full-time roles, internships, and exciting collaborations. Let&apos;s talk.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Left — Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}`, color: '#00E5FF' },
                  { icon: MapPin, label: 'Location', value: personalInfo.location, href: '#', color: '#7C3AED' },
                ].map(({ icon: Icon, label, value, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-4 p-4 rounded-xl glass border border-white/[0.07] hover:border-cyan/20 transition-all group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">{label}</p>
                      <p className="text-sm font-medium text-text-primary group-hover:text-cyan transition-colors">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-4">
                  Find me on
                </p>
                <div className="grid grid-cols-3 sm:flex gap-3">
                  {personalInfo.social.map((s) => {
                    const Icon = socialIcons[s.icon] || Github
                    return (
                      <motion.a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playClick()}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl glass border border-white/[0.07] hover:border-cyan/20 transition-all group"
                        title={s.platform}
                      >
                        <Icon size={20} className="text-text-secondary group-hover:text-cyan transition-colors" />
                        <span className="text-xs text-text-secondary">{s.platform}</span>
                      </motion.a>
                    )
                  })}
                </div>
              </div>

              {/* Availability badge */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-green animate-ping-slow" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Available for Opportunities</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Open to full-time SDE, AI, and ML roles. Response time: &lt; 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-text-primary/90 uppercase tracking-wide mb-2 block">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary placeholder-white/30 text-sm focus:outline-none focus:border-cyan/30 focus:bg-cyan/[0.02] transition-all font-body"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-text-primary/90 uppercase tracking-wide mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary placeholder-white/30 text-sm focus:outline-none focus:border-cyan/30 focus:bg-cyan/[0.02] transition-all font-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-text-primary/90 uppercase tracking-wide mb-2 block">
                    Company / Role (optional)
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g., Google — Recruiter"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary placeholder-white/30 text-sm focus:outline-none focus:border-cyan/30 focus:bg-cyan/[0.02] transition-all font-body"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-text-primary/90 uppercase tracking-wide mb-2 block">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about the role, project, or collaboration..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary placeholder-white/30 text-sm focus:outline-none focus:border-cyan/30 focus:bg-cyan/[0.02] transition-all resize-none font-body"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all relative overflow-hidden"
                  style={{
                    background: status === 'success'
                      ? 'rgba(0,255,135,0.15)'
                      : 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.15))',
                    border: status === 'success'
                      ? '1px solid rgba(0,255,135,0.35)'
                      : '1px solid rgba(0,229,255,0.35)',
                    color: status === 'success' ? '#00FF87' : '#F0F0FF',
                  }}
                >
                  {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
                  {status === 'success' && <CheckCircle2 size={16} />}
                  {status === 'idle' && <Send size={16} />}
                  {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : "Send Message"}
                </motion.button>

                {status === 'error' && (
                  <p className="text-xs text-neon-pink text-center">
                    Something went wrong. Please email me directly.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
