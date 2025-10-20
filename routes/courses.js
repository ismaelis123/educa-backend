const express = require('express');
const { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  getCourseContent 
} = require('../controllers/courseController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/:courseId/content', auth, getCourseContent);
router.post('/', auth, adminAuth, upload.single('image'), createCourse);

module.exports = router;