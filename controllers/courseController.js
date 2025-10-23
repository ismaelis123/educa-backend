const Course = require('../models/Course');
const Content = require('../models/Content');
const User = require('../models/User');

// Obtener todos los cursos
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, search, free } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (free === 'true') filter.isFree = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('vendor', 'name email vendorInfo')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo cursos',
      error: error.message
    });
  }
};

// Obtener curso por ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('vendor', 'name email vendorInfo');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo curso',
      error: error.message
    });
  }
};

// Crear curso (vendor o admin)
exports.createCourse = async (req, res) => {
  try {
    const courseData = { 
      ...req.body,
      vendor: req.user._id // Asignar el vendedor automáticamente
    };
    
    if (req.file) {
      courseData.image = `/uploads/${req.file.filename}`;
    }

    // Si el usuario es student, no puede crear cursos
    if (req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Los estudiantes no pueden crear cursos'
      });
    }

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creando curso',
      error: error.message
    });
  }
};

// Obtener cursos por vendedor
exports.getVendorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ vendor: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo cursos del vendedor',
      error: error.message
    });
  }
};