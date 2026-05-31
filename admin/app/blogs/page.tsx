'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, Search, X, Loader2, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react'
import { adminApi } from '@/lib/auth'
import toast from 'react-hot-toast'

// â”€â”€ Blog Form Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BlogModal({ blog, onClose, onSave }: { blog?: any; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    tags: (blog?.tags || []).join(', '),
    category: blog?.category || '',
    published: blog?.published ?? false,
  })
  
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(blog?.coverImage ? `http://localhost:5001${blog.coverImage}` : '')
  const [dragOver, setDragOver] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) {
      setImage(f)
      setImagePreview(URL.createObjectURL(f))
    } else {
      toast.error('Please upload a valid image file')
    }
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setImage(f)
      setImagePreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      fd.set('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim()).filter(Boolean)))
      if (image) fd.append('image', image)

      if (blog?._id) await adminApi.updateBlog(blog._id, fd)
      else await adminApi.createBlog(fd)

      toast.success(`Blog post ${blog ? 'updated' : 'created'}!`)
      onSave()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save blog')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none transition-all bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/40"
  const label = (t: string) => <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">{t}</label>

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-3xl my-4 rounded-2xl overflow-hidden" style={{ background: '#0a0a18', border: '1px solid rgba(0,229,255,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-base font-semibold text-white">{blog ? 'Edit Blog Post' : 'New Blog Post'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.05]"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* LinkedIn-style Image Upload Zone */}
          <div>
            {label('Cover Image')}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('blog-image-upload')?.click()}
              className={`relative overflow-hidden group flex flex-col items-center justify-center min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                dragOver ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center gap-2 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon size={20} className="text-white" />
                    <span className="text-xs font-medium text-white">Click to change cover image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3">
                    <Upload size={20} className="text-cyan-400" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">Click or drag image to upload</p>
                  <p className="text-xs text-gray-300">We recommend a 16:9 aspect ratio image for best results.</p>
                </div>
              )}
              <input id="blog-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>{label('Title *')}<input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Blog post title" /></div>
            <div>{label('Category')}<input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="AI, Web Dev, Tutorial..." /></div>
          </div>

          <div>{label('Excerpt')}<textarea rows={2} className={inputCls} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary" /></div>
          <div>{label('Content (Markdown) *')}<textarea required rows={10} className={inputCls} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your blog post in markdown..." /></div>
          <div>{label('Tags (comma-separated)')}<input className={inputCls} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="react, ai, tutorial..." /></div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-cyan-400" />
            <label htmlFor="published" className="text-sm text-gray-400 cursor-pointer">Publish immediately</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 border border-white/[0.08] hover:border-white/20 hover:text-white transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {saving ? 'Saving…' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function BlogsPage() {
  const [blogs, setBlogs]       = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modalOpen, setModal]   = useState(false)
  const [editing, setEditing]   = useState<any>(null)

  const load = async () => {
    try { setLoading(true); const { data } = await adminApi.getBlogs(); setBlogs(data.blogs || data) }
    catch { toast.error('Failed to load blogs') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return
    try { await adminApi.deleteBlog(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  const filtered = blogs.filter((b) => b.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Blog Posts</h1>
          <p className="text-sm text-gray-300 mt-0.5">{blogs.length} total</p>
        </div>
        <button onClick={() => { setEditing(null); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
          <Plus size={15} /> New Blog Post
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blog posts..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none bg-white/[0.04] border border-white/[0.07] focus:border-cyan-500/30 transition-all" />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Title', 'Category', 'Status', 'Views', 'Date', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mono text-gray-300 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No blog posts found</td></tr>
            ) : filtered.map((b) => (
              <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-medium text-sm text-white">{b.title}</div>
                  <div className="text-xs text-gray-400 truncate max-w-xs">{b.excerpt}</div>
                </td>
                <td className="px-4 py-3.5"><span className="text-xs font-mono text-gray-400 px-2 py-1 rounded-lg bg-white/[0.04]">{b.category || '—'}</span></td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${b.published ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-300 font-mono flex items-center gap-1"><Eye size={12} /> {b.views || 0}</td>
                <td className="px-4 py-3.5 text-xs text-gray-400 font-mono">{new Date(b.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditing(b); setModal(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(b._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={15} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modalOpen && <BlogModal blog={editing} onClose={() => setModal(false)} onSave={load} />}
      </AnimatePresence>
    </div>
  )
}
