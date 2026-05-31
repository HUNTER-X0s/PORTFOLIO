const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Certification = require('../models/Certification');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `cert-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET all certifications
router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.json({ success: true, certifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create certification (admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.skills && typeof data.skills === 'string') data.skills = JSON.parse(data.skills);
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const cert = await Certification.create(data);
    res.status(201).json({ success: true, certification: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update certification (admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.skills && typeof data.skills === 'string') data.skills = JSON.parse(data.skills);
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const cert = await Certification.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!cert) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, certification: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE certification (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
