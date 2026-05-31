const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  tagline:     { type: String, default: '' },
  description: { type: String, default: '' },
  problem:     { type: String, default: '' },
  solution:    { type: String, default: '' },
  impact:      { type: String, default: '' },
  liveUrl:     { type: String, default: '' },
  githubUrl:   { type: String, default: '' },
  image:       { type: String, default: '' },
  tech:        [{ type: String }],
  category:    { type: String, default: '' },
  year:        { type: Number, default: () => new Date().getFullYear() },
  status:      { type: String, enum: ['live', 'in-progress', 'archived'], default: 'live' },
  featured:    { type: Boolean, default: false },
  roles:       [{ type: String }],
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
