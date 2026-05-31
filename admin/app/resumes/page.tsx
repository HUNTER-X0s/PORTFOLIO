'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, FileText, Download, Plus, X, Loader2, CheckCircle } from 'lucide-react'
import { adminApi } from '@/lib/auth'
import toast from 'react-hot-toast'

function UploadModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [file, setFile]     = useState<File | null>(null)
  const [label, setLabel]   = useState('')
  const [role, setRole]     = useState('')
  const [saving, setSaving] = useState(false)
  const [dragOver, setDrag] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) { setFile(f); setLabel(f.name) }
    else toast.error('No file selected')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { toast.error('Select a PDF file'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('label', label || file.name)
      fd.append('role', role)
      await adminApi.uploadResume(fd)
      toast.success('Resume uploaded!')
      onSave(); onClose()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Upload failed') }
    finally { setSaving(false) }
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none transition-all bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/40"

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: '#0a0a18', border: '1px solid rgba(0,229,255,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-base font-semibold text-white">Upload Resume</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.05]"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${dragOver ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/[0.1] bg-white/[0.02]'}`}
            onClick={() => document.getElementById('resume-file')?.click()}
          >
            <Upload size={24} className="text-gray-300" />
            {file ? (
              <div className="text-center">
                <p className="text-sm text-cyan-400">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-400">Drop file here or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">Max 10 MB · Any file type</p>
              </div>
            )}
            <input id="resume-file" type="file" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) { setFile(f); setLabel(f.name) }
            }} />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Label</label>
            <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Full Stack Developer Resume" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Target Role</label>
            <input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. AI Engineer, Full Stack..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 border border-white/[0.08] hover:border-white/20 hover:text-white transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {saving ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModal] = useState(false)

  const load = async () => {
    try { setLoading(true); const { data } = await adminApi.getResumes(); setResumes(data.resumes || data) }
    catch { toast.error('Failed to load resumes') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return
    try { await adminApi.deleteResume(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Resumes</h1>
          <p className="text-sm text-gray-300 mt-0.5">{resumes.length} uploaded</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
          <Plus size={15} /> Upload Resume
        </button>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[1, 2].map((i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      ) : resumes.length === 0 ? (
        <div className="rounded-2xl p-16 text-center text-gray-400 text-sm" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
          <FileText size={32} className="mx-auto mb-3 text-gray-700" />
          No resumes uploaded yet. Click "Upload Resume" to add one.
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-5 py-4 rounded-2xl transition-all hover:bg-white/[0.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,107,43,0.12)', border: '1px solid rgba(255,107,43,0.25)' }}>
                  <FileText size={18} className="text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.label}</p>
                  <p className="text-xs text-gray-400">{r.role && `${r.role} · `}{(r.size / 1024).toFixed(0)} KB · {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={`http://localhost:5001${r.path}`} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all" title="Download">
                  <Download size={15} />
                </a>
                <button onClick={() => handleDelete(r._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && <UploadModal onClose={() => setModal(false)} onSave={load} />}
      </AnimatePresence>
    </div>
  )
}
