const Course = require('../models/Course');
const Content = require('../models/Content');

// Obtener todos los cursos
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    
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
    const course = await Course.findById(req.params.id);
    
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

// Crear curso (admin)
exports.createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body };
    
    if (req.file) {
      courseData.image = `/uploads/${req.file.filename}`;
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

// Obtener contenido del curso
exports.getCourseContent = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    // Verificar si el usuario tiene acceso al curso
    const user = await User.findById(userId);
    const hasAccess = user.purchasedCourses.includes(courseId) || 
                     user.role === 'admin';

    const content = await Content.find({ course: courseId })
      .sort({ order: 1 });

    // Filtrar contenido gratuito vs pagado
    const filteredContent = hasAccess ? 
      content : 
      content.filter(item => item.isFree);

    res.json({
      success: true,
      data: {
        content: filteredContent,
        hasFullAccess: hasAccess
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo contenido',
      error: error.message
    });
  }
};