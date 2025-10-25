const express = require('express');
const { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  getVendorCourses,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { auth, vendorAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/vendor/my-courses', auth, vendorAuth, getVendorCourses);
router.post('/', auth, vendorAuth, upload.single('image'), createCourse);
router.put('/:id', auth, vendorAuth, upload.single('image'), updateCourse);
router.delete('/:id', auth, vendorAuth, deleteCourse);

module.exports = router;