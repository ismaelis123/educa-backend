const Course = require('../models/Course');

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
      .populate('vendor', 'name email')
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
      .populate('vendor', 'name email');
    
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

// Crear curso
exports.createCourse = async (req, res) => {
  try {
    const courseData = { 
      ...req.body,
      vendor: req.user._id
    };
    
    if (req.file) {
      courseData.image = `/uploads/${req.file.filename}`;
    }

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

// Actualizar curso
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findOne({ _id: id, vendor: req.user._id });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado o no tienes permisos'
      });
    }

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedCourse,
      message: 'Curso actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error actualizando curso',
      error: error.message
    });
  }
};

// Eliminar curso
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, vendor: req.user._id });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado o no tienes permisos'
      });
    }

    await Course.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando curso',
      error: error.message
    });
  }
};