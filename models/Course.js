const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['primaria', 'secundaria', 'universidad', 'programacion', 'otros']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  isFree: {
    type: Boolean,
    default: false
  },
  level: {
    type: String,
    enum: ['basico', 'intermedio', 'avanzado'],
    default: 'basico'
  },
  duration: {
    type: String,
    default: '0 horas'
  },
  instructor: {
    type: String,
    default: 'Admin'
  },
  whatsappMessage: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);