const express = require('express');
const { 
  createContent, 
  getCourseContent, 
  updateContent, 
  deleteContent 
} = require('../controllers/contentController');
const { auth, vendorAuth } = require('../middleware/auth');
const upload = require('../middleware/upload'); // ← Importación simple
const router = express.Router();

// Obtener contenido de un curso
router.get('/course/:courseId', auth, getCourseContent);

// Crear contenido (diferentes tipos)
router.post('/course/:courseId/video', auth, vendorAuth, upload.single('video'), createContent);
router.post('/course/:courseId/pdf', auth, vendorAuth, upload.single('pdf'), createContent);
router.post('/course/:courseId/image', auth, vendorAuth, upload.single('image'), createContent);
router.post('/course/:courseId/text', auth, vendorAuth, createContent);
router.post('/course/:courseId/link', auth, vendorAuth, createContent);

// Actualizar y eliminar contenido
router.put('/:contentId', auth, vendorAuth, updateContent);
router.delete('/:contentId', auth, vendorAuth, deleteContent);

module.exports = router;