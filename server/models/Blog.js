const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, unique: true },
  excerpt:     { type: String, default: '' },
  content:     { type: String, default: '' },
  coverImage:  { type: String, default: '' },
  tags:        [{ type: String }],
  category:    { type: String, default: '' },
  published:   { type: Boolean, default: false },
  views:       { type: Number, default: 0 },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
