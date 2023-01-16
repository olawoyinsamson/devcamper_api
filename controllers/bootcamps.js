const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/asyncAwait');
const ErrorResponse = require('../util/errorResponse');
const path = require('path');

// @desc Get all Bootcamps
// @route  GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => { 
    res.status(200).send(res.advancedResult);
})


// @desc Get single Bootcamps
// @route  GET /api/v1/bootcamps/id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
    
        if(!bootcamp){
            return next(err);
        }
        res.status(200).send({success : true, data :bootcamp});
})

// @desc Create new Bootcamps
// @route  POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success : true,
        data : bootcamp
    })

})


// @desc Update Bootcamps
// @route  PUT /api/v1/bootcamps/id
// @access  Private
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true
    });

    if(!bootcamp){
        return next(err);
    }

    res.status(200).send({success : true, data : bootcamp});
})

// @desc Delete Bootcamps
// @route  Delete /api/v1/bootcamps
// @access  Private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp){
        return next(err);
    }

    res.status(200).send({success : true, data : {}});
});

// @desc Upload Photo for bootcamp
// @route  PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    }

    const file = req.files.file;

    if(!req.files){
        return next(new ErrorResponse(`Please upload a file ${req.params.id}`,400));
    }   

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image less than`, 400));
    }

    // Check filesize
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400));
    }

    //CREATE CUSTOME FILE NAME
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err);
            return next(
                new ErrorResponse(
                    `Problem with file upload`,
                    500
                )
            )
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name });

        res.status(200).json({success : true, data :file.name});
    })
     
    
})