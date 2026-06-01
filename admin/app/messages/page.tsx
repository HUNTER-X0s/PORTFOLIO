'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, Eye, CheckCheck, Search, Reply } from 'lucide-react'
import { adminApi } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [search, setSearch]     = useState('')

  const load = async () => {
    try { const { data } = await adminApi.getMessages(); setMessages(data.messages || data) }
    catch { toast.error('Failed to load messages') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleRead = async (id: string) => {
    try { await adminApi.markRead(id); load() }
    catch { toast.error('Failed to mark read') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try { await adminApi.deleteMessage(id); toast.success('Deleted'); setSelected(null); load() }
    catch { toast.error('Failed to delete') }
  }

  const filtered = messages.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  )
  const unread = messages.filter((m) => !m.isRead).length

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Messages</h1>
          <p className="text-sm text-gray-300 mt-0.5">{messages.length} total · {unread} unread</p>
        </div>
        {unread > 0 && (
          <span className="px-3 py-1.5 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            {unread} new
          </span>
        )}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none bg-white/[0.04] border border-white/[0.07] focus:border-cyan-500/30 transition-all" />
      </div>

      <div className="grid md:grid-cols-[1fr_400px] gap-4">
        {/* Message list */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {loading ? <div className="py-12 px-4 text-center text-gray-400 text-sm">Loading…</div> :
            filtered.length === 0 ? <div className="py-12 px-4 text-center text-gray-400 text-sm">No messages</div> :
            <div className="divide-y divide-white/[0.04] max-h-[600px] overflow-y-auto">
              {filtered.map((msg) => (
                <motion.div key={msg._id} onClick={() => { setSelected(msg); if (!msg.isRead) handleRead(msg._id) }}
                  className={`px-4 py-3.5 cursor-pointer transition-all ${selected?._id === msg._id ? 'bg-cyan-500/[0.06]' : 'hover:bg-white/[0.02]'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-xs text-cyan-400 font-bold flex-shrink-0 mt-0.5">
                        {msg.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-white' : 'text-gray-300'}`}>{msg.name}</p>
                          {!msg.isRead && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-300 truncate">{msg.company && `${msg.company} · `}{msg.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{msg.message}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-700 font-mono flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          }
        </div>

        {/* Message detail */}
        {selected ? (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-cyan-400" />
                <span className="text-sm font-medium text-white">Message Detail</span>
              </div>
              <div className="flex items-center gap-1.5">
                <a href={`mailto:${selected.email}`} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all" title="Reply">
                  <Reply size={15} />
                </a>
                <button onClick={() => handleDelete(selected._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2.5">
                {[
                  { label: 'From', value: selected.name },
                  { label: 'Email', value: selected.email },
                  selected.company && { label: 'Company', value: selected.company },
                  { label: 'Date', value: new Date(selected.createdAt).toLocaleString() },
                ].filter(Boolean).map((f: any) => (
                  <div key={f.label} className="flex gap-3">
                    <span className="text-xs text-gray-400 font-mono w-14 pt-0.5 flex-shrink-0">{f.label}</span>
                    <span className="text-sm text-gray-300">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/[0.06]">
                <p className="text-xs text-gray-400 font-mono mb-2">Message:</p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}?subject=Re: Portfolio Inquiry`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(0,229,255,0.10)', border: '1px solid rgba(0,229,255,0.25)', color: '#00E5FF' }}>
                <Reply size={14} /> Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl flex items-center justify-center p-12 text-gray-700 text-sm" style={{ border: '1px dashed rgba(255,255,255,0.07)' }}>
            Select a message to view
          </div>
        )}
      </div>
    </div>
  )
}
