const express = require('express');
const { auth, vendorAuth } = require('../middleware/auth');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const router = express.Router();

// Obtener estadísticas del vendedor
router.get('/stats', auth, vendorAuth, async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ vendor: req.user._id });
    const freeCourses = await Course.countDocuments({ 
      vendor: req.user._id, 
      isFree: true 
    });
    const paidCourses = await Course.countDocuments({ 
      vendor: req.user._id, 
      isFree: false 
    });

    // Calcular ingresos
    const payments = await Payment.find({ 
      status: 'completed'
    }).populate('course');

    const vendorPayments = payments.filter(payment => 
      payment.course.vendor.toString() === req.user._id.toString()
    );

    const totalRevenue = vendorPayments.reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      success: true,
      data: {
        totalCourses,
        freeCourses,
        paidCourses,
        totalRevenue,
        totalSales: vendorPayments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
});

module.exports = router;