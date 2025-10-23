const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso denegado. No hay token.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido.' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. Se requiere rol de admin.' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error en autenticación de admin.' 
    });
  }
};

const vendorAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. Se requiere rol de vendedor o admin.' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error en autenticación de vendedor.' 
    });
  }
};

module.exports = { auth, adminAuth, vendorAuth };