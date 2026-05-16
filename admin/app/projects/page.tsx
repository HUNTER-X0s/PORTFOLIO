'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, ExternalLink, Search, X, Upload, Loader2, CheckCircle } from 'lucide-react'
import { adminApi } from '@/lib/auth'
import toast from 'react-hot-toast'

// ── Project Form Modal ────────────────────────────────────────
function ProjectModal({ project, onClose, onSave }: { project?: any; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    title: project?.title || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    problem: project?.problem || '',
    solution: project?.solution || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    tech: (project?.tech || []).join(', '),
    category: project?.category || '',
    year: project?.year || new Date().getFullYear(),
    status: project?.status || 'live',
    featured: project?.featured || false,
    roles: (project?.roles || []).join(', '),
    impact: project?.impact || '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      if (form.tech) fd.set('tech', JSON.stringify(form.tech.split(',').map((t) => t.trim()).filter(Boolean)))
      if (form.roles) fd.set('roles', JSON.stringify(form.roles.split(',').map((r) => r.trim()).filter(Boolean)))
      if (image) fd.append('image', image)

      if (project?._id) await adminApi.updateProject(project._id, fd)
      else await adminApi.createProject(fd)

      toast.success(`Project ${project ? 'updated' : 'created'} successfully!`)
      onSave()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/40"
  const label = (t: string) => <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">{t}</label>

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl my-4 rounded-2xl overflow-hidden" style={{ background: '#0a0a18', border: '1px solid rgba(0,229,255,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-base font-semibold text-white">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05]"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>{label('Title *')}<input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name" /></div>
            <div>{label('Category *')}<input required className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="AI/ML, Web App..." /></div>
          </div>

          <div>{label('Tagline *')}<input required className={inputCls} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="One-line description" /></div>
          <div>{label('Description *')}<textarea required rows={3} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Full project description" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>{label('Problem')}<textarea rows={2} className={inputCls} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} /></div>
            <div>{label('Solution')}<textarea rows={2} className={inputCls} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} /></div>
          </div>
          <div>{label('Impact')}<input className={inputCls} value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} placeholder="Key metric or business impact" /></div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>{label('Live URL *')}<input required type="url" className={inputCls} value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://" /></div>
            <div>{label('GitHub URL')}<input type="url" className={inputCls} value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." /></div>
          </div>

          <div>{label('Tech Stack (comma-separated)')}<input className={inputCls} value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} placeholder="Python, React, MongoDB..." /></div>
          <div>{label('Roles (comma-separated)')}<input className={inputCls} value={form.roles} onChange={(e) => setForm({ ...form, roles: e.target.value })} placeholder="ai_engineer, fullstack..." /></div>

          <div className="grid grid-cols-3 gap-4">
            <div>{label('Year')}<input type="number" className={inputCls} value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })} /></div>
            <div>{label('Status')}
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="live">Live</option><option value="in-progress">In Progress</option><option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-cyan-400" />
                <span className="text-sm text-gray-400">Featured</span>
              </label>
            </div>
          </div>

          {/* Image upload */}
          <div>
            {label('Project Image')}
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all bg-white/[0.03] border border-dashed border-white/[0.1] hover:border-cyan-500/30">
              <Upload size={16} className="text-gray-500" />
              <span className="text-sm text-gray-500">{image ? image.name : 'Click to upload image'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 border border-white/[0.08] hover:border-white/20 hover:text-white transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {saving ? 'Saving…' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modalOpen, setModal]   = useState(false)
  const [editing, setEditing]   = useState<any>(null)

  const load = async () => {
    try { setLoading(true); const { data } = await adminApi.getProjects(); setProjects(data.projects || data) }
    catch { toast.error('Failed to load projects') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try { await adminApi.deleteProject(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  const filtered = projects.filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">{projects.length} total</p>
        </div>
        <button onClick={() => { setEditing(null); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none bg-white/[0.04] border border-white/[0.07] focus:border-cyan-500/30 transition-all" />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Title', 'Category', 'Status', 'Year', 'Live URL', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-600 text-sm">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-600 text-sm">No projects found</td></tr>
            ) : filtered.map((p) => (
              <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-medium text-sm text-white">{p.title}</div>
                  <div className="text-xs text-gray-600 truncate max-w-xs">{p.tagline}</div>
                </td>
                <td className="px-4 py-3.5"><span className="text-xs font-mono text-gray-400 px-2 py-1 rounded-lg bg-white/[0.04]">{p.category}</span></td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${p.status === 'live' ? 'text-green-400 bg-green-400/10' : p.status === 'in-progress' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-500 bg-gray-500/10'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-500 font-mono">{p.year}</td>
                <td className="px-4 py-3.5">
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-cyan-400 hover:underline">
                    <ExternalLink size={11} /> Live
                  </a>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditing(p); setModal(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={13} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modalOpen && <ProjectModal project={editing} onClose={() => setModal(false)} onSave={load} />}
      </AnimatePresence>
    </div>
  )
}
