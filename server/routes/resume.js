const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// GET all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json({ success: true, resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST upload resume (admin)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const resume = await Resume.create({
      label: req.body.label || req.file.originalname,
      filename: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      role: req.body.role || '',
      size: req.file.size,
    });
    res.status(201).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE resume (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
