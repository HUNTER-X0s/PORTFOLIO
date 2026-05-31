'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Key, Palette, Globe, Save, Loader2, Shield, Mail, Code } from 'lucide-react'
import { useAuthStore, adminApi } from '@/lib/auth'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'site', label: 'Site Config', icon: Globe },
]

export default function SettingsPage() {
  const { admin, login } = useAuthStore() // assuming we just reload or logout on email/pass change
  const [tab, setTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  // Profile forms
  const [profileName, setProfileName] = useState(admin?.name || '')
  
  // Email form
  const [newEmail, setNewEmail] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passSaving, setPassSaving] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await adminApi.updateProfile({ name: profileName })
      useAuthStore.getState().updateAdmin(data.admin)
      toast.success('Profile updated successfully!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailSaving(true)
    try {
      await adminApi.updateEmail({ newEmail })
      toast.success('Email updated! Please log in again.')
      useAuthStore.getState().logout()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update email')
    } finally {
      setEmailSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassSaving(true)
    try {
      await adminApi.updatePassword({ currentPassword, newPassword })
      toast.success('Password updated! Please log in again.')
      useAuthStore.getState().logout()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setPassSaving(false)
    }
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none transition-all bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/40"
  const label = (t: string) => <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">{t}</label>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20} /> Settings</h1>
        <p className="text-sm text-gray-300 mt-0.5">Manage your admin account and site configuration</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${active ? 'text-cyan-400' : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'}`}
              style={active ? { background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' } : { border: '1px solid transparent' }}>
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 space-y-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-lg text-cyan-400 font-bold">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-base font-semibold text-white">{admin?.name || 'Admin'}</p>
              <p className="text-sm text-gray-300">{admin?.email || '—'}</p>
              <p className="text-xs text-cyan-400/60 font-mono mt-0.5">{admin?.role || 'admin'}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
            <div>{label('Display Name')}<input required value={profileName} onChange={(e) => setProfileName(e.target.value)} className={inputCls} placeholder="Your name" /></div>
            <div>{label('Bio (Optional)')}<textarea rows={3} className={inputCls} placeholder="Brief description about yourself..." /></div>

            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Profile
            </button>
          </form>
        </motion.div>
      )}

      {tab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Email Update */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
              <Mail size={18} className="text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-white">Change Email Address</p>
                <p className="text-xs text-gray-400">You will be required to log in again after changing your email.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateEmail} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Current Email</label>
                <input disabled value={admin?.email || ''} className={`${inputCls} opacity-60 cursor-not-allowed`} />
              </div>
              <div>{label('New Email')}<input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputCls} placeholder="new.admin@example.com" /></div>

              <button type="submit" disabled={emailSaving || !newEmail}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
                {emailSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Update Email
              </button>
            </form>
          </div>

          {/* Password Update */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
              <Key size={18} className="text-yellow-400" />
              <div>
                <p className="text-sm font-semibold text-white">Change Password</p>
                <p className="text-xs text-gray-400">Ensure your new password is secure.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
              <div>{label('Current Password')}<input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} placeholder="Enter your current password" /></div>
              <div>{label('New Password')}<input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} placeholder="Enter a strong new password" /></div>

              <button type="submit" disabled={passSaving || !currentPassword || !newPassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
                {passSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Update Password
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {tab === 'site' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 space-y-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
            <Palette size={18} className="text-pink-400" />
            <div>
              <p className="text-sm font-semibold text-white">Site Configuration</p>
              <p className="text-xs text-gray-400">Service endpoints and connections</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Portfolio Frontend', value: 'http://localhost:3000', status: 'running' },
              { label: 'Admin Dashboard', value: 'http://localhost:3001', status: 'running' },
              { label: 'Backend API', value: 'http://localhost:5001', status: 'running' },
              { label: 'RAG Chatbot API', value: 'http://localhost:8001', status: 'running' },
              { label: 'MongoDB', value: 'localhost:27017/portfolio', status: 'connected' },
              { label: 'Ollama', value: 'http://localhost:11434', status: 'running' },
            ].map((s) => {
              const isUrl = s.value.startsWith('http')
              return (
                <div key={s.label} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm text-gray-300">{s.label}</span>
                  <div className="flex items-center gap-2">
                    {isUrl ? (
                      <a href={s.value} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-cyan-400 hover:underline">
                        {s.value}
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-gray-300">{s.value}</span>
                    )}
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
