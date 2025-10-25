const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Registrar usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'student'
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      },
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registrando usuario',
      error: error.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar usuario y password
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        },
        message: 'Login exitoso'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en login',
      error: error.message
    });
  }
};

// Obtener perfil
exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo perfil',
      error: error.message
    });
  }
};