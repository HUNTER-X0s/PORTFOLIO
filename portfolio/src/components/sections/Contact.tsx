'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView, useSound } from '@/hooks'
import { personalInfo } from '@/data/portfolio'
import {
  Send, Mail, MapPin, CheckCircle2,
  Loader2, User, Building, MessageSquare, Sparkles, Copy, Check
} from 'lucide-react'
import type { ContactForm } from '@/types'
import { Dynamic3DCard } from '@/components/animations/Dynamic3DCard'
import { Dynamic3DText } from '@/components/animations/Dynamic3DText'
import { SocialIcon } from '@/components/icons/SocialIcons'



export default function Contact() {
  const { ref, inView } = useInView(0.05)
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
      try { navigator.vibrate([30, 50, 30]) } catch { }
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
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="section-header"
          >
            <p className="section-label">09 / Contact</p>
            <Dynamic3DText intensity={12} enableDepth={true}>
              <h2 className="section-title text-3d-title">
                Let&apos;s <span className="text-gradient">Build Together</span>
              </h2>
            </Dynamic3DText>
            <p className="section-subtitle">
              Open to full-time roles, internships, and exciting collaborations. Let&apos;s talk.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* Left — Contact info */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-3.5">
                {/* Email card with quick copy */}
                <Dynamic3DCard intensity={12} depth={15} glowColor="rgba(0, 229, 255, 0.25)">
                  <div className="flex items-center justify-between p-5 sm:p-6 rounded-2xl glass border border-white/[0.08] hover:border-cyan/40 transition-all group h-full">
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="flex items-center gap-4 flex-1 min-w-0"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(0, 229, 255, 0.12)', border: '1px solid rgba(0, 229, 255, 0.25)' }}
                      >
                        <Mail size={20} className="text-cyan" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-text-secondary font-mono">Email Address</p>
                        <p className="text-base sm:text-lg font-bold font-display text-text-primary group-hover:text-cyan transition-colors truncate text-3d-interactive">
                          {personalInfo.email}
                        </p>
                      </div>
                    </a>
                    <button
                      onClick={copyEmail}
                      className="p-2.5 rounded-xl text-text-secondary hover:text-cyan hover:bg-cyan/10 transition-all ml-2 flex-shrink-0"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check size={16} className="text-neon-green" /> : <Copy size={16} />}
                    </button>
                  </div>
                </Dynamic3DCard>

                {/* Location card */}
                <Dynamic3DCard intensity={12} depth={15} glowColor="rgba(124, 58, 237, 0.25)">
                  <div className="flex items-center gap-4 p-5 sm:p-6 rounded-2xl glass border border-white/[0.08] hover:border-violet/40 transition-all group h-full">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.25)' }}
                    >
                      <MapPin size={20} className="text-violet" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-text-secondary font-mono">Location</p>
                      <p className="text-base sm:text-lg font-bold font-display text-text-primary group-hover:text-violet transition-colors text-3d-interactive">
                        {personalInfo.location}
                      </p>
                    </div>
                  </div>
                </Dynamic3DCard>
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs sm:text-sm font-mono text-text-secondary uppercase tracking-widest mb-3">
                  Find me on
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
                  {personalInfo.social.map((s) => {
                    return (
                      <Dynamic3DCard key={s.platform} intensity={15} depth={16} glowColor="rgba(0, 229, 255, 0.25)">
                        <motion.a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playClick()}
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center justify-center gap-2 px-1.5 py-3 sm:px-2 sm:py-3.5 rounded-xl glass border border-white/[0.08] hover:border-cyan/40 transition-all group w-full h-full text-center"
                          title={s.platform}
                        >
                          <SocialIcon platform={s.platform} size={22} className="text-text-secondary group-hover:text-cyan transition-colors" />
                          <span className="text-[11.5px] min-[400px]:text-xs sm:text-[12.5px] lg:text-[12px] xl:text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors whitespace-nowrap tracking-tight w-full text-center block">
                            {s.platform}
                          </span>
                        </motion.a>
                      </Dynamic3DCard>
                    )
                  })}
                </div>
              </div>

              {/* Availability badge */}
              <Dynamic3DCard intensity={10} depth={15} glowColor="rgba(0, 255, 135, 0.2)">
                <div className="glass-card p-5 sm:p-6 rounded-2xl relative overflow-hidden border border-white/[0.08] hover:border-neon-green/40 transition-all group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3 sm:gap-3.5 relative z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-neon-green animate-ping-slow flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-base sm:text-lg text-text-primary text-3d-interactive leading-tight">
                        Available for Opportunities
                      </p>
                      <p className="text-xs sm:text-[13px] md:text-[13.5px] xl:text-sm text-text-secondary mt-1 leading-normal whitespace-nowrap tracking-tight">
                        Open to full-time SDE, AI, and ML roles. Response time: &lt; 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </Dynamic3DCard>
            </motion.div>

            {/* Right — Interactive Dynamic Contact Form (Non-3D Tilt, Flat Ergonomic) */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
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

              <div
                className="relative p-6 sm:p-7 rounded-2xl border border-white/[0.12] hover:border-cyan/65 shadow-2xl backdrop-blur-2xl space-y-6 overflow-hidden bg-[#070A16]/92 transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,229,255,0.28),0_0_70px_rgba(0,229,255,0.12),inset_0_0_20px_rgba(0,229,255,0.05)]"
                style={{
                  transform: 'none',
                  transformStyle: 'flat',
                  willChange: 'auto',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {/* Form top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan via-violet to-transparent opacity-80" />

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <label className="text-xs sm:text-sm font-mono font-medium text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 select-none">
                        <User size={13} className={activeField === 'name' ? 'text-cyan' : 'text-slate-400'} />
                        <span className="tracking-wide">Name *</span>
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
                          style={{
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            textRendering: 'optimizeLegibility',
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-[#030611]/85 border border-white/[0.12] text-white placeholder-slate-400/60 text-sm sm:text-base focus:outline-none focus:border-cyan/70 focus:bg-[#030611]/95 focus:shadow-[0_0_18px_rgba(0,229,255,0.2)] transition-all font-body font-normal"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="text-xs sm:text-sm font-mono font-medium text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 select-none">
                        <Mail size={13} className={activeField === 'email' ? 'text-cyan' : 'text-slate-400'} />
                        <span className="tracking-wide">Email *</span>
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
                          style={{
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            textRendering: 'optimizeLegibility',
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-[#030611]/85 border border-white/[0.12] text-white placeholder-slate-400/60 text-sm sm:text-base focus:outline-none focus:border-cyan/70 focus:bg-[#030611]/95 focus:shadow-[0_0_18px_rgba(0,229,255,0.2)] transition-all font-body font-normal"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Field */}
                  <div>
                    <label className="text-xs sm:text-sm font-mono font-medium text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 select-none">
                      <Building size={13} className={activeField === 'company' ? 'text-violet' : 'text-slate-400'} />
                      <span className="tracking-wide">Company / Organization (optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onFocus={() => setActiveField('company')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Google, Microsoft, Startup, Freelance"
                      style={{
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility',
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-[#030611]/85 border border-white/[0.12] text-white placeholder-slate-400/60 text-sm sm:text-base focus:outline-none focus:border-violet/70 focus:bg-[#030611]/95 focus:shadow-[0_0_18px_rgba(124,58,237,0.2)] transition-all font-body font-normal"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs sm:text-sm font-mono font-medium text-slate-200 uppercase tracking-wider flex items-center gap-1.5 select-none">
                        <MessageSquare size={13} className={activeField === 'message' ? 'text-neon-green' : 'text-slate-400'} />
                        <span className="tracking-wide">Message *</span>
                      </label>
                      <span className="text-xs font-mono font-medium text-slate-400">
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
                            const fakeEvent = { preventDefault: () => { } } as React.FormEvent
                            handleSubmit(fakeEvent)
                          }
                        }
                      }}
                      placeholder="Tell me about the role, project requirements, or just start a conversation..."
                      style={{
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility',
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-[#030611]/85 border border-white/[0.12] text-white placeholder-slate-400/60 text-sm sm:text-base focus:outline-none focus:border-neon-green/70 focus:bg-[#030611]/95 focus:shadow-[0_0_18px_rgba(0,255,135,0.2)] transition-all resize-none font-body font-normal leading-relaxed"
                    />
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm sm:text-base tracking-wide transition-all relative overflow-hidden group cursor-pointer shadow-lg select-none hover:border-cyan hover:shadow-[0_0_28px_rgba(0,229,255,0.45)]"
                    style={{
                      background: status === 'success'
                        ? 'linear-gradient(135deg, rgba(0,255,135,0.28), rgba(0,229,255,0.22))'
                        : 'linear-gradient(135deg, rgba(0,229,255,0.24), rgba(124,58,237,0.30))',
                      border: status === 'success'
                        ? '1px solid rgba(0,255,135,0.65)'
                        : '1px solid rgba(0,229,255,0.5)',
                      color: status === 'success' ? '#00FF87' : '#FFFFFF',
                      boxShadow: status === 'success'
                        ? '0 0 24px rgba(0,255,135,0.3)'
                        : '0 0 24px rgba(0,229,255,0.2)',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                    }}
                  >
                    {/* Top button sheen */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                    {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
                    {status === 'success' && <CheckCircle2 size={16} className="text-neon-green" />}
                    {status === 'idle' && <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan flex-shrink-0" />}
                    <span className="font-semibold text-sm sm:text-base text-white tracking-wide">{status === 'loading' ? 'Sending Message...' : status === 'success' ? 'Message Sent Successfully!' : "Send Message"}</span>
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

