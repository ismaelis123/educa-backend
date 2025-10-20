const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'whatsapp'
  },
  transactionId: {
    type: String,
    unique: true
  },
  whatsappConfirmed: {
    type: Boolean,
    default: false
  },
  adminApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generar transactionId automáticamente
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TX' + Date.now() + Math.random().toString(36).substr(2, 9);
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);