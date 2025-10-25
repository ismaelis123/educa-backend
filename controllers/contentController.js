const Content = require('../models/Content');
const Course = require('../models/Course');

// Crear contenido
exports.createContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, type, description, duration, isFree, order } = req.body;

    const course = await Course.findOne({ _id: courseId, vendor: req.user._id });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado o no tienes permisos'
      });
    }

    let contentUrl = '';
    let fileSize = '';

    if (type === 'video' || type === 'pdf' || type === 'image') {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Archivo requerido para este tipo de contenido'
        });
      }
      contentUrl = `/uploads/${req.file.filename}`;
      fileSize = req.file.size ? `${Math.round(req.file.size / 1024 / 1024)}MB` : '';
    } else if (type === 'link') {
      contentUrl = req.body.contentUrl || '';
    } else if (type === 'text') {
      contentUrl = req.body.content || '';
    }

    const content = await Content.create({
      course: courseId,
      title,
      type,
      contentUrl,
      duration,
      isFree: isFree || false,
      order: order || 0,
      description,
      fileSize
    });

    res.status(201).json({
      success: true,
      data: content,
      message: 'Contenido creado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creando contenido',
      error: error.message
    });
  }
};

// Obtener contenido del curso
exports.getCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;

    const content = await Content.find({ course: courseId })
      .sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      data: content,
      count: content.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo contenido',
      error: error.message
    });
  }
};

// Obtener contenido por ID
exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.contentId)
      .populate('course');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    res.json({
      success: true,
      data: content
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
    const course = await Course.findOne({ _id: content.course._id, vendor: req.user._id });
    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este contenido'
      });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedContent,
      message: 'Contenido actualizado exitosamente'
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
    const course = await Course.findOne({ _id: content.course._id, vendor: req.user._id });
    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este contenido'
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