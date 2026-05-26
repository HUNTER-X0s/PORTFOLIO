'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderCode, FileText, MessageSquare,
  Award, LogOut, Menu, X, ChevronRight,
  Bell, Settings, User
} from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import { cn } from '@/lib/utils'
import toast, { Toaster } from 'react-hot-toast'

const NAV_ITEMS = [
  { href: '/dashboard',        label: 'Dashboard',       icon: LayoutDashboard, color: '#00E5FF' },
  { href: '/projects',         label: 'Projects',        icon: FolderCode,      color: '#7C3AED' },
  { href: '/blogs',            label: 'Blog Posts',      icon: FileText,        color: '#00FF87' },
  { href: '/messages',         label: 'Messages',        icon: MessageSquare,   color: '#FFE500' },
  { href: '/resumes',          label: 'Resumes',         icon: User,            color: '#FF6B2B' },
  { href: '/certifications',   label: 'Certifications',  icon: Award,           color: '#FF2D9C' },
]

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname  = usePathname()
  const { admin, logout } = useAuthStore()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col overflow-hidden"
      style={{ background: 'rgba(8,8,20,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06] h-16">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.3), rgba(124,58,237,0.3))', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
                A
              </div>
              <span className="text-sm font-semibold text-white font-mono">Admin CMS</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={onToggle} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all ml-auto">
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{ x: 2 }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
                active ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'
              )}
              style={active ? { background: `${item.color}12`, border: `1px solid ${item.color}20` } : {}}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} style={{ color: active ? item.color : undefined, flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && <motion.div layoutId="active-pill" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: item.color }} />}
            </motion.a>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        {!collapsed && admin && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-bold flex-shrink-0">
              {admin.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{admin.name}</p>
              <p className="text-[10px] text-gray-600 truncate">{admin.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); toast.success('Logged out') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const sidebarW = collapsed ? 64 : 240

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#080814', color: '#F0F0FF' }}>
        {pathname === '/login' ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <div className="min-h-screen" style={{ background: '#080814' }}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

            {/* Main area */}
            <motion.main
              animate={{ marginLeft: sidebarW }}
              transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="min-h-screen"
            >
              {/* Top bar */}
              <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b border-white/[0.06]" style={{ background: 'rgba(8,8,20,0.95)', backdropFilter: 'blur(16px)' }}>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                  <span className="text-cyan-400">~/admin</span>
                  {pathname.split('/').filter(Boolean).map((seg, i, arr) => (
                    <span key={seg} className="flex items-center gap-2">
                      <ChevronRight size={12} />
                      <span className={i === arr.length - 1 ? 'text-white' : ''}>{seg}</span>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all">
                    <Bell size={16} />
                  </button>
                  <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all">
                    <Settings size={16} />
                  </button>
                </div>
              </header>

              <div className="p-6">{children}</div>
            </motion.main>

            <Toaster position="top-right" toastOptions={{
              style: { background: '#0f0f22', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F0FF', fontSize: '13px' },
            }} />
          </div>
        )}
      </body>
    </html>
  )
}
