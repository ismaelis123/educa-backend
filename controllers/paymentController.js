const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');

// Iniciar proceso de pago
exports.initiatePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar si ya tiene el curso
    const user = await User.findById(userId);
    if (user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes acceso a este curso'
      });
    }

    // Crear pago pendiente
    const payment = await Payment.create({
      user: userId,
      course: courseId,
      amount: course.price,
      status: 'pending'
    });

    // Generar mensaje de WhatsApp
    const whatsappMessage = `Hola! Quiero comprar el curso: ${course.title}. 
Precio: $${course.price}
Mi número: ${user.phone}
Transaction ID: ${payment.transactionId}`;

    const whatsappUrl = `https://wa.me/506TU_NUMERO?text=${encodeURIComponent(whatsappMessage)}`;

    res.json({
      success: true,
      data: {
        payment,
        whatsappUrl,
        course: {
          title: course.title,
          price: course.price,
          whatsappMessage: course.whatsappMessage
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error iniciando pago',
      error: error.message
    });
  }
};

// Verificar pago (para que tú marques como aprobado)
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const payment = await Payment.findOne({ transactionId })
      .populate('user', 'name email phone')
      .populate('course', 'title price');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verificando pago',
      error: error.message
    });
  }
};

// Aprobar pago (tú ejecutas esto después del pago por WhatsApp)
exports.approvePayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const payment = await Payment.findOne({ transactionId })
      .populate('user')
      .populate('course');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    // Actualizar estado del pago
    payment.status = 'completed';
    payment.adminApproved = true;
    payment.whatsappConfirmed = true;
    await payment.save();

    // Agregar curso al usuario
    const user = await User.findById(payment.user._id);
    if (!user.purchasedCourses.includes(payment.course._id)) {
      user.purchasedCourses.push(payment.course._id);
      await user.save();
    }

    res.json({
      success: true,
      data: {
        message: 'Pago aprobado y curso asignado al usuario',
        payment,
        user: {
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error aprobando pago',
      error: error.message
    });
  }
};

// Obtener historial de pagos del usuario
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('course', 'title price image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo pagos',
      error: error.message
    });
  }
};