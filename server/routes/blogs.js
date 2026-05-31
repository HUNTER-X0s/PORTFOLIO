const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    blog.views += 1;
    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create blog (admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.tags && typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    if (data.published) data.published = data.published === 'true';
    if (req.file) data.coverImage = `/uploads/${req.file.filename}`;

    const blog = await Blog.create(data);
    res.status(201).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update blog (admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.tags && typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    if (data.published) data.published = data.published === 'true';
    if (req.file) data.coverImage = `/uploads/${req.file.filename}`;

    const blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE blog (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
