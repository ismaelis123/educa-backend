const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'text', 'quiz', 'link', 'image'],
    required: true
  },
  contentUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: '0 min'
  },
  isFree: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  fileSize: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);