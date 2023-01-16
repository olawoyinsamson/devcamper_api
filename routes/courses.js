const express = require('express');
const { getCourses,getCourse,addCourse, updateCourse, deleteCourse}  = require('../controllers/courses');
const router = express.Router({mergeParams : true});
const { protect } = require('../middleware/auth');

const Course = require('../models/Courses');
const advancedResult = require('../middleware/advanceResult');

router.route('/').get(advancedResult(Course,{path : 'bootcamp',select : 'name description'}),getCourses).post(protect, addCourse);
router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);

module.exports = router;