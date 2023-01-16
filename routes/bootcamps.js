const express = require('express');
const {getBootcamp,
    getBootcamps,
    createBootcamp, 
    updateBootcamps, 
    bootcampPhotoUpload,
    deleteBootcamps} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advanceResult');

// Include other resources routers
const courseRouter = require('./courses');

const router = express.Router();
//const api_path = '/api/v1/';

const { protect } = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:bootcampId/course', courseRouter);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

router.route('/')
      .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
      .post(protect, createBootcamp);

router.route('/:id')
      .get(getBootcamp)
      .put(protect, updateBootcamps)
      .delete(protect, deleteBootcamps);


module.exports = router;