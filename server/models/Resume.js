const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  label:    { type: String, required: true },
  filename: { type: String, required: true },
  path:     { type: String, required: true },
  role:     { type: String, default: '' },
  size:     { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
