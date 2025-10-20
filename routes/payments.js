const express = require('express');
const { 
  initiatePayment, 
  verifyPayment, 
  approvePayment, 
  getUserPayments 
} = require('../controllers/paymentController');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/initiate', auth, initiatePayment);
router.post('/verify', auth, verifyPayment);
router.post('/approve', auth, adminAuth, approvePayment);
router.get('/history', auth, getUserPayments);

module.exports = router;