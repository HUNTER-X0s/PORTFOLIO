'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView, useSound } from '@/hooks'
import { personalInfo } from '@/data/portfolio'
import {
  Send, Mail, MapPin, Github, Linkedin, Twitter, CheckCircle2,
  Loader2, User, Building, MessageSquare, Sparkles, Copy, Check
} from 'lucide-react'
import type { ContactForm } from '@/types'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'

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
  const [activeField, setActiveField] = useState<string | null>(null)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email)
    setCopiedEmail(true)
    playClick()
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playClick()

    if (!form.name || !form.email || !form.message) return

    const payload = { ...form }

    // Instant optimistic response — 0ms UI delay!
    setStatus('success')
    setForm({ name: '', email: '', company: '', message: '' })


    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([30, 50, 30]) } catch {}
    }

    // Fire network request in background
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (!res.ok) {
        setStatus('error')
      }
    }).catch(() => {
      setStatus('error')
    })

    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <div className="py-10 sm:py-14 md:py-20">
      <div className="section-container">
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-header"
          >
            <p className="section-label">09 / Contact</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Let&apos;s <span className="text-gradient">Build Together</span>
              </h2>
            </Dynamic3DText>
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
              className="space-y-6"
            >
              <div className="space-y-3.5">
                {/* Email card with quick copy */}
                <Dynamic3DCard intensity={12} depth={15} glowColor="rgba(0, 229, 255, 0.25)">
                  <div className="flex items-center justify-between p-4 rounded-xl glass border border-white/[0.08] hover:border-cyan/40 transition-all group h-full">
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="flex items-center gap-4 flex-1 min-w-0"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(0, 229, 255, 0.12)', border: '1px solid rgba(0, 229, 255, 0.25)' }}
                      >
                        <Mail size={18} className="text-cyan" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-text-secondary font-mono">Email Address</p>
                        <p className="text-sm font-medium text-text-primary group-hover:text-cyan transition-colors truncate text-3d-interactive">
                          {personalInfo.email}
                        </p>
                      </div>
                    </a>
                    <button
                      onClick={copyEmail}
                      className="p-2 rounded-lg text-text-secondary hover:text-cyan hover:bg-cyan/10 transition-all ml-2 flex-shrink-0"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check size={16} className="text-neon-green" /> : <Copy size={16} />}
                    </button>
                  </div>
                </Dynamic3DCard>

                {/* Location card */}
                <Dynamic3DCard intensity={12} depth={15} glowColor="rgba(124, 58, 237, 0.25)">
                  <div className="flex items-center gap-4 p-4 rounded-xl glass border border-white/[0.08] hover:border-violet/40 transition-all group h-full">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.25)' }}
                    >
                      <MapPin size={18} className="text-violet" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary font-mono">Location</p>
                      <p className="text-sm font-medium text-text-primary group-hover:text-violet transition-colors text-3d-interactive">
                        {personalInfo.location}
                      </p>
                    </div>
                  </div>
                </Dynamic3DCard>
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-3">
                  Find me on
                </p>
                <div className="grid grid-cols-3 sm:flex gap-3">
                  {personalInfo.social.map((s) => {
                    const Icon = socialIcons[s.icon] || Github
                    return (
                      <Dynamic3DCard key={s.platform} intensity={15} depth={16} glowColor="rgba(0, 229, 255, 0.25)">
                        <motion.a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playClick()}
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl glass border border-white/[0.08] hover:border-cyan/40 transition-all group w-full"
                          title={s.platform}
                        >
                          <Icon size={20} className="text-text-secondary group-hover:text-cyan transition-colors" />
                          <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">{s.platform}</span>
                        </motion.a>
                      </Dynamic3DCard>
                    )
                  })}
                </div>
              </div>

              {/* Availability badge */}
              <Dynamic3DCard intensity={10} depth={15} glowColor="rgba(0, 255, 135, 0.2)">
                <div className="glass-card p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3 relative z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-neon-green animate-ping-slow flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary text-3d-interactive">Available for Opportunities</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Open to full-time SDE, AI, and ML roles. Response time: &lt; 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </Dynamic3DCard>
            </motion.div>

            {/* Right — Interactive Dynamic Contact Form (Non-3D Tilt, Flat Ergonomic) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              {/* Interactive Ambient Aura behind form that reacts to focused field */}
              <div
                className="absolute -inset-1 rounded-2xl opacity-60 blur-xl transition-all duration-700 pointer-events-none"
                style={{
                  background: activeField === 'message'
                    ? 'radial-gradient(circle at 50% 70%, rgba(0, 255, 135, 0.2), transparent 70%)'
                    : activeField === 'email'
                    ? 'radial-gradient(circle at 75% 30%, rgba(0, 229, 255, 0.25), transparent 70%)'
                    : activeField === 'company'
                    ? 'radial-gradient(circle at 50% 40%, rgba(124, 58, 237, 0.25), transparent 70%)'
                    : 'radial-gradient(circle at 50% 30%, rgba(0, 229, 255, 0.15), rgba(124, 58, 237, 0.1), transparent 70%)',
                }}
              />

              <div className="relative glass-card p-6 sm:p-7 rounded-2xl border border-white/[0.1] shadow-2xl backdrop-blur-xl space-y-6 overflow-hidden">
                {/* Form top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan via-violet to-transparent opacity-80" />



                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <label className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <User size={11} className={activeField === 'name' ? 'text-cyan' : 'text-text-tertiary'} />
                        <span>Name *</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={form.name}
                          onFocus={() => setActiveField('name')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-text-primary placeholder-white/25 text-sm focus:outline-none focus:border-cyan/60 focus:bg-cyan/[0.03] focus:shadow-[0_0_16px_rgba(0,229,255,0.15)] transition-all font-body"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Mail size={11} className={activeField === 'email' ? 'text-cyan' : 'text-text-tertiary'} />
                        <span>Email *</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={form.email}
                          onFocus={() => setActiveField('email')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-text-primary placeholder-white/25 text-sm focus:outline-none focus:border-cyan/60 focus:bg-cyan/[0.03] focus:shadow-[0_0_16px_rgba(0,229,255,0.15)] transition-all font-body"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Field */}
                  <div>
                    <label className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Building size={11} className={activeField === 'company' ? 'text-violet' : 'text-text-tertiary'} />
                      <span>Company / Organization (optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onFocus={() => setActiveField('company')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Google, Microsoft, Startup, Freelance"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-text-primary placeholder-white/25 text-sm focus:outline-none focus:border-violet/60 focus:bg-violet/[0.03] focus:shadow-[0_0_16px_rgba(124,58,237,0.15)] transition-all font-body"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare size={11} className={activeField === 'message' ? 'text-neon-green' : 'text-text-tertiary'} />
                        <span>Message *</span>
                      </label>
                      <span className="text-[10px] font-mono text-text-tertiary">
                        {form.message.length} chars
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                          e.preventDefault()
                          if (form.name && form.email && form.message && status !== 'loading') {
                            const fakeEvent = { preventDefault: () => {} } as React.FormEvent
                            handleSubmit(fakeEvent)
                          }
                        }
                      }}
                      placeholder="Tell me about the role, project requirements, or just start a conversation..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-text-primary placeholder-white/25 text-sm focus:outline-none focus:border-neon-green/60 focus:bg-neon-green/[0.02] focus:shadow-[0_0_16px_rgba(0,255,135,0.15)] transition-all resize-none font-body leading-relaxed"
                    />
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all relative overflow-hidden group cursor-pointer shadow-lg"
                    style={{
                      background: status === 'success'
                        ? 'linear-gradient(135deg, rgba(0,255,135,0.25), rgba(0,229,255,0.2))'
                        : 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,237,0.25))',
                      border: status === 'success'
                        ? '1px solid rgba(0,255,135,0.6)'
                        : '1px solid rgba(0,229,255,0.4)',
                      color: status === 'success' ? '#00FF87' : '#FFFFFF',
                      boxShadow: status === 'success'
                        ? '0 0 20px rgba(0,255,135,0.25)'
                        : '0 0 20px rgba(0,229,255,0.15)',
                    }}
                  >
                    {/* Top button sheen */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                    {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
                    {status === 'success' && <CheckCircle2 size={16} className="text-neon-green" />}
                    {status === 'idle' && <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan" />}
                    <span>{status === 'loading' ? 'Sending Message...' : status === 'success' ? 'Message Sent Successfully!' : "Send Message"}</span>
                  </motion.button>

                  <AnimatePresence>
                    {status === 'success' && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-neon-green text-center font-mono"
                      >
                        ✓ Received! I will get back to you within 24 hours.
                      </motion.p>
                    )}
                    {status === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-neon-pink text-center font-mono"
                      >
                        Something went wrong. Please email directly at anurag.swain35@gmail.com.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

