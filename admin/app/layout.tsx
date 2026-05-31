'use client'
import './globals.css'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
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

function Sidebar({ collapsed, onToggle, isMobile }: { collapsed: boolean; onToggle: () => void; isMobile: boolean }) {
  const pathname  = usePathname()
  const { admin, logout } = useAuthStore()

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isMobile ? 240 : (collapsed ? 64 : 240),
        x: isMobile ? (collapsed ? -240 : 0) : 0
      }}
      transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
      className="fixed left-0 top-0 bottom-0 z-[60] flex flex-col overflow-hidden"
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
        <button onClick={onToggle} className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all ml-auto">
          {(!isMobile && collapsed) ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} passHref legacyBehavior>
              <motion.a
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl group relative"
                style={active
                  ? { background: `${item.color}12`, border: `1px solid ${item.color}20` }
                  : { border: '1px solid transparent' }
                }
                title={(!isMobile && collapsed) ? item.label : undefined}
                onClick={() => {
                  if (isMobile) onToggle();
                }}
              >
                {/* hover bg — only this transitions */}
                {!active && (
                  <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-150 pointer-events-none" />
                )}
                <Icon size={16} style={{ color: active ? item.color : undefined, flexShrink: 0 }}
                  className={active ? '' : 'text-gray-300 group-hover:text-gray-200 transition-colors duration-150'}
                />
                <AnimatePresence>
                  {(isMobile || !collapsed) && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className={cn('text-sm font-medium whitespace-nowrap', active ? 'text-white' : 'text-gray-300 group-hover:text-gray-200')}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 flex items-center">
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, scaleY: 0.4 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ duration: 0.15 }}
                      className="w-0.5 h-5 rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                )}
              </motion.a>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        {(isMobile || !collapsed) && admin && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-bold flex-shrink-0">
              {admin.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{admin.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{admin.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); toast.success('Logged out') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
          title={(!isMobile && collapsed) ? 'Logout' : undefined}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {(isMobile || !collapsed) && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sidebarW = isMobile ? 0 : (collapsed ? 64 : 240)

  return (
    <html lang="en">
      <head>
        <title>Admin CMS Portal | Anurag Swain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body style={{ margin: 0, background: '#080814', color: '#F0F0FF' }}>
        {pathname === '/login' ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <div className="min-h-screen" style={{ background: '#080814' }}>
            
            {/* Mobile Backdrop */}
            <AnimatePresence>
              {isMobile && !collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setCollapsed(true)}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                />
              )}
            </AnimatePresence>

            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobile={isMobile} />

            {/* Main area */}
            <motion.main
              animate={{ marginLeft: sidebarW }}
              transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="min-h-screen flex flex-col"
            >
              {/* Top bar */}
              <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 border-b border-white/[0.06] flex-shrink-0" style={{ background: 'rgba(8,8,20,0.95)', backdropFilter: 'blur(16px)' }}>
                <div className="flex items-center gap-2 text-sm text-gray-300 font-mono overflow-hidden">
                  {isMobile && (
                    <button onClick={() => setCollapsed(false)} className="mr-2 p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all">
                      <Menu size={18} />
                    </button>
                  )}
                  <span className="text-cyan-400 hidden sm:inline">~/admin</span>
                  {pathname.split('/').filter(Boolean).map((seg, i, arr) => (
                    <span key={seg} className="flex items-center gap-1 sm:gap-2 truncate">
                      <ChevronRight size={12} className="hidden sm:block" />
                      <span className={i === arr.length - 1 ? 'text-white truncate' : 'truncate'}>{seg}</span>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/messages" className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all" title="Messages">
                    <Bell size={16} />
                  </Link>
                  <Link href="/settings" className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all" title="Settings">
                    <Settings size={16} />
                  </Link>
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
