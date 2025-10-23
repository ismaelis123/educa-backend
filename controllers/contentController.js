const Content = require('../models/Content');
const Course = require('../models/Course');

// Crear contenido para un curso
exports.createContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, type, description, duration, isFree, order } = req.body;

    // Verificar que el curso existe y pertenece al vendedor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar que el usuario es el vendedor o admin
    if (course.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para agregar contenido a este curso'
      });
    }

    let contentUrl = '';

    // Manejar diferentes tipos de contenido
    if (type === 'video' && req.file) {
      contentUrl = `/uploads/${req.file.filename}`;
    } else if (type === 'pdf' && req.file) {
      contentUrl = `/uploads/${req.file.filename}`;
    } else if (type === 'image' && req.file) {
      contentUrl = `/uploads/${req.file.filename}`;
    } else if (type === 'text' || type === 'link') {
      contentUrl = req.body.contentUrl || '';
    }

    const content = await Content.create({
      course: courseId,
      title,
      type,
      contentUrl,
      description,
      duration,
      isFree: isFree || false,
      order: order || 0,
      fileSize: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(2)} MB` : ''
    });

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creando contenido',
      error: error.message
    });
  }
};

// Obtener contenido de un curso
exports.getCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar acceso al contenido
    const user = req.user;
    const hasAccess = user.purchasedCourses.includes(courseId) || 
                     course.isFree ||
                     user.role === 'admin' ||
                     course.vendor.toString() === userId.toString();

    const content = await Content.find({ course: courseId })
      .sort({ order: 1, createdAt: 1 });

    // Filtrar contenido según acceso
    const filteredContent = hasAccess ? 
      content : 
      content.filter(item => item.isFree);

    res.json({
      success: true,
      data: {
        content: filteredContent,
        hasFullAccess: hasAccess,
        course: {
          title: course.title,
          isFree: course.isFree,
          price: course.price,
          instructor: course.instructor
        }
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

// Actualizar contenido
exports.updateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const updates = req.body;

    const content = await Content.findById(contentId).populate('course');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Verificar permisos
    if (content.course.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este contenido'
      });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error actualizando contenido',
      error: error.message
    });
  }
};

// Eliminar contenido
exports.deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findById(contentId).populate('course');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Verificar permisos
    if (content.course.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este contenido'
      });
    }

    await Content.findByIdAndDelete(contentId);

    res.json({
      success: true,
      message: 'Contenido eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando contenido',
      error: error.message
    });
  }
};