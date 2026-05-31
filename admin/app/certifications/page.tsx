'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Award, Search, X, Upload, Loader2, CheckCircle, ExternalLink, Image as ImageIcon, FileText } from 'lucide-react'
import { adminApi } from '@/lib/auth'
import toast from 'react-hot-toast'

function CertModal({ cert, onClose, onSave }: { cert?: any; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    title: cert?.title || '',
    issuer: cert?.issuer || '',
    date: cert?.date || '',
    credentialId: cert?.credentialId || '',
    credentialUrl: cert?.credentialUrl || '',
    skills: (cert?.skills || []).join(', '),
  })

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(cert?.image ? `http://localhost:5001${cert.image}` : '')
  const [dragOver, setDragOver] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) {
      setImage(f)
      if (f.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(f))
      } else {
        setImagePreview('file')
      }
    }
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setImage(f)
      if (f.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(f))
      } else {
        setImagePreview('file')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.set('skills', JSON.stringify(form.skills.split(',').map((s) => s.trim()).filter(Boolean)))
      if (image) fd.append('image', image)

      if (cert?._id) await adminApi.updateCertification(cert._id, fd)
      else await adminApi.createCertification(fd)

      toast.success(`Certification ${cert ? 'updated' : 'added'}!`)
      onSave(); onClose()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none transition-all bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/40"
  const label = (t: string) => <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">{t}</label>

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg my-4 rounded-2xl overflow-hidden" style={{ background: '#0a0a18', border: '1px solid rgba(0,229,255,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-base font-semibold text-white">{cert ? 'Edit Certification' : 'New Certification'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.05]"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* LinkedIn-style Image Upload Zone */}
          <div>
            {label('Certificate Image')}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('cert-image-upload')?.click()}
              className={`relative overflow-hidden group flex flex-col items-center justify-center min-h-[140px] rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                dragOver ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              {imagePreview && imagePreview !== 'file' ? (
                <>
                  <img src={imagePreview} alt="Certificate preview" className="absolute inset-0 w-full h-full object-contain p-2 opacity-80 group-hover:opacity-40 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center gap-2 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon size={20} className="text-white" />
                    <span className="text-xs font-medium text-white">Click to change file</span>
                  </div>
                </>
              ) : imagePreview === 'file' || (image && !image.type.startsWith('image/')) ? (
                <div className="flex flex-col items-center text-center p-6 opacity-80 group-hover:opacity-40 transition-opacity">
                  <FileText size={32} className="text-cyan-400 mb-3" />
                  <p className="text-sm font-medium text-white">{image?.name || 'Document Attached'}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3">
                    <Upload size={20} className="text-cyan-400" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">Click or drag file to upload</p>
                  <p className="text-xs text-gray-300">Add an image, PDF, or document.</p>
                </div>
              )}
              <input id="cert-image-upload" type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleImageSelect} />
            </div>
          </div>

          <div>{label('Title *')}<input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AWS Solutions Architect" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>{label('Issuer')}<input className={inputCls} value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Amazon Web Services" /></div>
            <div>{label('Date')}<input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Jan 2024" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>{label('Credential ID')}<input className={inputCls} value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} placeholder="ABC-123..." /></div>
            <div>{label('Credential URL')}<input className={inputCls} type="url" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div>{label('Skills (comma-separated)')}<input className={inputCls} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Cloud, DevOps..." /></div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 border border-white/[0.08] hover:border-white/20 hover:text-white transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CertificationsPage() {
  const [certs, setCerts]       = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modalOpen, setModal]   = useState(false)
  const [editing, setEditing]   = useState<any>(null)

  const load = async () => {
    try { setLoading(true); const { data } = await adminApi.getCertifications(); setCerts(data.certifications || data) }
    catch { toast.error('Failed to load certifications') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    try { await adminApi.deleteCertification(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  const filtered = certs.filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Certifications</h1>
          <p className="text-sm text-gray-300 mt-0.5">{certs.length} total</p>
        </div>
        <button onClick={() => { setEditing(null); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
          <Plus size={15} /> New Certification
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search certifications..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none bg-white/[0.04] border border-white/[0.07] focus:border-cyan-500/30 transition-all" />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-16 text-center text-gray-400 text-sm" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Award size={32} className="mx-auto mb-3 text-gray-700" />
          No certifications yet
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 relative overflow-hidden group transition-all hover:bg-white/[0.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="absolute top-0 left-0 right-0 h-px opacity-60" style={{ background: 'linear-gradient(90deg, #FF2D9C, transparent)' }} />
              <div className="flex items-start justify-between gap-3">
                {c.image && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 bg-white/[0.02] border border-white/[0.05]">
                    {c.image.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                      <img src={`http://localhost:5001${c.image}`} alt={c.title} className="w-full h-full object-cover" />
                    ) : (
                      <a href={`http://localhost:5001${c.image}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full hover:bg-white/[0.04] transition-colors">
                        <FileText size={18} className="text-cyan-400" />
                      </a>
                    )}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                  <p className="text-xs text-gray-300 mt-0.5">{c.issuer}{c.date && ` · ${c.date}`}</p>
                  {c.credentialId && <p className="text-[10px] text-gray-700 font-mono mt-1">ID: {c.credentialId}</p>}
                  {c.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.skills.map((s: string) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-500/10 text-pink-400 font-mono">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 transition-opacity">
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><ExternalLink size={15} /></a>
                  )}
                  <button onClick={() => { setEditing(c); setModal(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Edit2 size={15} /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && <CertModal cert={editing} onClose={() => setModal(false)} onSave={load} />}
      </AnimatePresence>
    </div>
  )
}
