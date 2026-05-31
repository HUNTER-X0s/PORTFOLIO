const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// POST login & seed admin if not exists
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Seed logic: If no admin exists in DB at all, create one from .env
    let admin = await Admin.findOne();
    if (!admin) {
      admin = await Admin.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
    }

    // Now verify against the DB
    const attemptAdmin = await Admin.findOne({ email });
    if (!attemptAdmin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await attemptAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const payload = {
      admin: {
        id: attemptAdmin._id,
        name: attemptAdmin.name,
        email: attemptAdmin.email,
        role: attemptAdmin.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    return res.json({
      success: true,
      token,
      admin: payload.admin
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update profile (name)
router.put('/profile', auth, async (req, res) => {
  try {
    let admin = req.admin.id ? await Admin.findById(req.admin.id) : await Admin.findOne({ email: req.admin.email });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    if (req.body.name) admin.name = req.body.name;
    await admin.save();

    res.json({ success: true, message: 'Profile updated successfully', admin: { name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update email
router.put('/update-email', auth, async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ success: false, message: 'New email required' });

    let admin = req.admin.id ? await Admin.findById(req.admin.id) : await Admin.findOne({ email: req.admin.email });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    // Check if new email is already taken by someone else
    const existing = await Admin.findOne({ email: newEmail });
    if (existing && existing._id.toString() !== admin._id.toString()) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }

    admin.email = newEmail;
    await admin.save();

    res.json({ success: true, message: 'Email updated successfully', email: admin.email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update password
router.put('/update-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords required' });
    }

    let admin = req.admin.id ? await Admin.findById(req.admin.id) : await Admin.findOne({ email: req.admin.email });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    admin.password = newPassword;
    await admin.save(); // Will trigger pre-save hook to hash new password

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
