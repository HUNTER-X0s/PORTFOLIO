const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Resume = require('../models/Resume');
const Certification = require('../models/Certification');

// GET admin dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [projects, blogs, messages, unreadMessages, resumes, certifications] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Resume.countDocuments(),
      Certification.countDocuments(),
    ]);

    res.json({
      success: true,
      projects,
      blogs,
      messages,
      unreadMessages,
      resumes,
      certifications,
      totalViews: 0,
      githubStars: 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
