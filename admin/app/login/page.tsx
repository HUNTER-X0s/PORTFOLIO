'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading } = useAuthStore()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      toast.success('Welcome back!')
      const from = searchParams.get('from') || '/dashboard'
      router.push(from)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00E5FF, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="rounded-2xl overflow-hidden" style={{
          background: 'rgba(10,10,24,0.95)',
          border: '1px solid rgba(0,229,255,0.2)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(0,229,255,0.06)',
          backdropFilter: 'blur(24px)',
        }}>
          {/* Top accent */}
          <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #00E5FF, #7C3AED, #00E5FF)' }} />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.15))',
                border: '1.5px solid rgba(0,229,255,0.3)',
              }}>
                <ShieldCheck size={26} className="text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-white font-mono">Admin Portal</h1>
              <p className="text-sm text-gray-500 mt-1">Anurag Swain · Portfolio CMS</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yourdomain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,229,255,0.35)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,229,255,0.35)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3 py-2.5 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </div>
              )}

              <motion.button
                type="submit" disabled={isLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.15))',
                  border: '1px solid rgba(0,229,255,0.35)',
                  color: '#F0F0FF',
                }}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
                {isLoading ? 'Authenticating…' : 'Sign In'}
              </motion.button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-6 font-mono">
              Protected · JWT · Admin Only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
