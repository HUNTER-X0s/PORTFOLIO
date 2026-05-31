const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  issuer:       { type: String, default: '' },
  date:         { type: String, default: '' },
  credentialId: { type: String, default: '' },
  credentialUrl:{ type: String, default: '' },
  image:        { type: String, default: '' },
  skills:       [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
