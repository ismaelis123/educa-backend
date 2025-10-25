const User = require('../models/User');
const Course = require('../models/Course');

// Guardar/desguardar curso
exports.toggleSaveCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    const isSaved = user.savedCourses.includes(courseId);
    
    if (isSaved) {
      user.savedCourses = user.savedCourses.filter(id => id.toString() !== courseId);
      await user.save();
      
      res.json({
        success: true,
        data: {
          message: 'Curso removido de guardados',
          isSaved: false
        }
      });
    } else {
      user.savedCourses.push(courseId);
      await user.save();
      
      res.json({
        success: true,
        data: {
          message: 'Curso guardado exitosamente',
          isSaved: true
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error guardando curso',
      error: error.message
    });
  }
};

// Obtener cursos guardados
exports.getSavedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedCourses', 'title description image category price level duration instructor isFree');

    res.json({
      success: true,
      data: user.savedCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo cursos guardados',
      error: error.message
    });
  }
};

// Verificar si un curso está guardado
exports.checkCourseSaved = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user._id);

    const isSaved = user.savedCourses.includes(courseId);

    res.json({
      success: true,
      data: { isSaved }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verificando curso guardado',
      error: error.message
    });
  }
};