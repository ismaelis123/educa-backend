const express = require('express');
const { 
  createContent, 
  getCourseContent, 
  updateContent, 
  deleteContent,
  getContentById
} = require('../controllers/contentController');
const { auth, vendorAuth } = require('../middleware/auth');
const { uploadVideo, uploadPdf, uploadImage } = require('../middleware/upload');
const router = express.Router();

router.get('/course/:courseId', auth, getCourseContent);
router.get('/:contentId', auth, getContentById);
router.post('/course/:courseId/video', auth, vendorAuth, uploadVideo, createContent);
router.post('/course/:courseId/pdf', auth, vendorAuth, uploadPdf, createContent);
router.post('/course/:courseId/image', auth, vendorAuth, uploadImage, createContent);
router.post('/course/:courseId/text', auth, vendorAuth, createContent);
router.post('/course/:courseId/link', auth, vendorAuth, createContent);
router.put('/:contentId', auth, vendorAuth, updateContent);
router.delete('/:contentId', auth, vendorAuth, deleteContent);

module.exports = router;