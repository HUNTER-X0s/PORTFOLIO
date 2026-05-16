'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderCode, FileText, MessageSquare, FileUser, Award, TrendingUp, Eye, Star } from 'lucide-react'
import { adminApi } from '@/lib/auth'

interface Stats {
  projects: number
  blogs: number
  messages: number
  unreadMessages: number
  resumes: number
  certifications: number
  totalViews: number
  githubStars: number
}

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: number | string; icon: any; color: string; sub?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-1 font-mono" style={{ color }}>{value}</p>
          {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}

function RecentMessages({ messages }: { messages: any[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Recent Messages</h2>
        <a href="/messages" className="text-xs text-cyan-400 hover:underline">View all</a>
      </div>
      {messages.length === 0 ? (
        <div className="p-8 text-center text-gray-600 text-sm">No messages yet</div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {messages.slice(0, 5).map((msg: any) => (
            <div key={msg._id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
              <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-xs text-cyan-400 font-bold flex-shrink-0 mt-0.5">
                {msg.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{msg.name}</p>
                  {!msg.isRead && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                <p className="text-[10px] text-gray-700 mt-0.5 font-mono">{msg.email}</p>
              </div>
              <p className="text-[10px] text-gray-700 font-mono flex-shrink-0">
                {new Date(msg.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getMessages()])
      .then(([statsRes, msgRes]) => {
        setStats(statsRes.data)
        setMessages(msgRes.data.messages || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Projects', value: stats?.projects ?? '—', icon: FolderCode, color: '#00E5FF', sub: 'Live + In Progress' },
    { label: 'Blog Posts', value: stats?.blogs ?? '—', icon: FileText, color: '#7C3AED', sub: 'Published articles' },
    { label: 'Messages', value: stats?.messages ?? '—', icon: MessageSquare, color: '#FFE500', sub: `${stats?.unreadMessages ?? 0} unread` },
    { label: 'Resumes', value: stats?.resumes ?? '—', icon: FileUser, color: '#FF6B2B', sub: 'Role-specific PDFs' },
    { label: 'Certifications', value: stats?.certifications ?? '—', icon: Award, color: '#FF2D9C', sub: 'Verified credentials' },
    { label: 'GitHub Stars', value: stats?.githubStars ?? '3', icon: Star, color: '#00FF87', sub: 'Across all repos' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-mono">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Portfolio CMS — Anurag Swain</p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl h-28 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider font-mono">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ New Project', href: '/projects?new=1', color: '#00E5FF' },
            { label: '+ New Blog Post', href: '/blogs?new=1', color: '#7C3AED' },
            { label: 'View Messages', href: '/messages', color: '#FFE500' },
            { label: 'Upload Resume', href: '/resumes?upload=1', color: '#FF6B2B' },
          ].map((a) => (
            <a key={a.label} href={a.href}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all hover:opacity-90"
              style={{ background: `${a.color}12`, border: `1px solid ${a.color}25`, color: a.color }}>
              {a.label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      <RecentMessages messages={messages} />
    </div>
  )
}
