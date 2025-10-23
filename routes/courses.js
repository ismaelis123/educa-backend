const express = require('express');
const { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  getVendorCourses
} = require('../controllers/courseController');
const { auth, vendorAuth } = require('../middleware/auth');
const upload = require('../middleware/upload'); // ← Importación simple
const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/vendor/my-courses', auth, vendorAuth, getVendorCourses);
router.post('/', auth, vendorAuth, upload.single('image'), createCourse);

module.exports = router;