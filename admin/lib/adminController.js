// ============================================================
// server/controllers/adminController.js
// Admin-specific endpoints: stats, dashboard data
// ============================================================

const Project       = require('../models/Project')
const { Blog, Message, Resume, Certification, Experience } = require('../models/index')
const axios         = require('axios')
const NodeCache     = require('node-cache')

const cache = new NodeCache({ stdTTL: 300 }) // 5 min cache

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const cached = cache.get('admin_stats')
    if (cached) return res.json(cached)

    const [projects, blogs, messages, unread, resumes, certs] = await Promise.all([
      Project.countDocuments({ isPublished: true }),
      Blog.countDocuments({ isPublished: true }),
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Resume.countDocuments({ isActive: true }),
      Certification.countDocuments({ isActive: true }),
    ])

    // Fetch GitHub stars
    let githubStars = 3
    try {
      const gh = await axios.get(
        `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos?per_page=100`,
        { headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}, timeout: 5000 }
      )
      githubStars = gh.data.reduce((sum, r) => sum + r.stargazers_count, 0)
    } catch {}

    const stats = { projects, blogs, messages, unreadMessages: unread, resumes, certifications: certs, githubStars }
    cache.set('admin_stats', stats)

    res.json(stats)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PATCH /api/contact/:id/read
const markMessageRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { isRead: true })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getStats, markMessageRead }

// ============================================================
// server/utils/seed.js — Admin user seeder
// ============================================================
// const mongoose = require('mongoose')
// const User = require('../models/User')
// require('dotenv').config()
//
// async function seed() {
//   await mongoose.connect(process.env.MONGODB_URI)
//   const existing = await User.findOne({ email: process.env.ADMIN_EMAIL })
//   if (existing) { console.log('Admin already exists'); process.exit(0) }
//   const admin = await User.create({
//     name: process.env.ADMIN_NAME || 'Anurag Swain',
//     email: process.env.ADMIN_EMAIL,
//     password: process.env.ADMIN_PASSWORD,
//     role: 'admin',
//   })
//   console.log(`✅ Admin created: ${admin.email}`)
//   process.exit(0)
// }
// seed().catch(console.error)
