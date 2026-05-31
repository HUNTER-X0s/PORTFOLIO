const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `project-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create project (admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.tech && typeof data.tech === 'string') data.tech = JSON.parse(data.tech);
    if (data.roles && typeof data.roles === 'string') data.roles = JSON.parse(data.roles);
    if (data.featured) data.featured = data.featured === 'true';
    if (data.year) data.year = Number(data.year);
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const project = await Project.create(data);
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update project (admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.tech && typeof data.tech === 'string') data.tech = JSON.parse(data.tech);
    if (data.roles && typeof data.roles === 'string') data.roles = JSON.parse(data.roles);
    if (data.featured) data.featured = data.featured === 'true';
    if (data.year) data.year = Number(data.year);
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE project (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
