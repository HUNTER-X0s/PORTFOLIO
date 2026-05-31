'use client'
// ── Auth Store ───────────────────────────────────────────────
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

interface AuthState {
  token: string | null
  admin: { name: string; email: string; role: string } | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setLoading: (v: boolean) => void
  updateAdmin: (admin: any) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await axios.post(`${API}/api/auth/login`, { email, password })
          const { token, admin } = data
          set({ token, admin, isLoading: false })
          Cookies.set('admin_token', token, { expires: 7, sameSite: 'strict' })
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (err: any) {
          set({ isLoading: false })
          throw new Error(err.response?.data?.message || 'Login failed')
        }
      },

      logout: () => {
        set({ token: null, admin: null })
        Cookies.remove('admin_token')
        delete axios.defaults.headers.common['Authorization']
        if (typeof window !== 'undefined') window.location.href = '/login'
      },

      setLoading: (v) => set({ isLoading: v }),
      updateAdmin: (admin) => set({ admin }),
    }),
    { name: 'admin-auth', partialize: (s) => ({ token: s.token, admin: s.admin }) }
  )
)

// ── Axios API client ─────────────────────────────────────────
export const apiClient = axios.create({ baseURL: API })

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── API helpers ──────────────────────────────────────────────
export const adminApi = {
  // Projects
  getProjects:        () => apiClient.get('/api/projects'),
  createProject:      (d: FormData) => apiClient.post('/api/projects', d),
  updateProject:      (id: string, d: FormData) => apiClient.put(`/api/projects/${id}`, d),
  deleteProject:      (id: string) => apiClient.delete(`/api/projects/${id}`),

  // Blogs
  getBlogs:           () => apiClient.get('/api/blogs'),
  createBlog:         (d: any) => apiClient.post('/api/blogs', d),
  updateBlog:         (id: string, d: any) => apiClient.put(`/api/blogs/${id}`, d),
  deleteBlog:         (id: string) => apiClient.delete(`/api/blogs/${id}`),

  // Messages
  getMessages:        (page = 1) => apiClient.get(`/api/contact?page=${page}&limit=20`),
  markRead:           (id: string) => apiClient.patch(`/api/contact/${id}/read`),
  deleteMessage:      (id: string) => apiClient.delete(`/api/contact/${id}`),

  // Resumes
  getResumes:         () => apiClient.get('/api/resume'),
  uploadResume:       (d: FormData) => apiClient.post('/api/resume', d),
  deleteResume:       (id: string) => apiClient.delete(`/api/resume/${id}`),

  // Certifications
  getCertifications:  () => apiClient.get('/api/certifications'),
  createCertification:(d: FormData) => apiClient.post('/api/certifications', d),
  updateCertification:(id: string, d: any) => apiClient.put(`/api/certifications/${id}`, d),
  deleteCertification:(id: string) => apiClient.delete(`/api/certifications/${id}`),

  // Stats
  getStats:           () => apiClient.get('/api/admin/stats'),

  // Auth & Settings
  updateProfile:      (d: any) => apiClient.put('/api/auth/profile', d),
  updateEmail:        (d: any) => apiClient.put('/api/auth/update-email', d),
  updatePassword:     (d: any) => apiClient.put('/api/auth/update-password', d),
}
