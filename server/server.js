/**
 * Portfolio Backend — Express.js Server
 * Full implementation delivered in Phase 4.
 * See SYSTEM_COMPLETE.md for the complete backend structure.
 *
 * To run:
 *   npm install
 *   cp .env.example .env   ← fill in your values
 *   node server.js
 */

const express   = require('express')
const mongoose  = require('mongoose')
const helmet    = require('helmet')
const cors      = require('cors')
const morgan    = require('morgan')
const path      = require('path')
require('dotenv').config()

const app = express()

// ── Middleware ────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── MongoDB ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err.message))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',           require('./routes/auth'))
app.use('/api/projects',       require('./routes/projects'))
app.use('/api/blogs',          require('./routes/blogs'))
app.use('/api/contact',        require('./routes/contact'))
app.use('/api/resume',         require('./routes/resume'))
app.use('/api/certifications', require('./routes/certifications'))
app.use('/api/experience',     require('./routes/experience'))
app.use('/api/github',         require('./routes/github'))
app.use('/api/admin',          require('./routes/admin'))

// ── Health ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// ── 404 & Error ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).json({ success: false, message: err.message })
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

module.exports = app
