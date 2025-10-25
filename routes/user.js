const express = require('express');
const { 
  toggleSaveCourse, 
  getSavedCourses, 
  checkCourseSaved 
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/save-course', auth, toggleSaveCourse);
router.get('/saved-courses', auth, getSavedCourses);
router.get('/check-saved/:courseId', auth, checkCourseSaved);

module.exports = router;