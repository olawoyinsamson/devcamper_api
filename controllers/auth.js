const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/asyncAwait');
const User = require('../models/User');


//@desc  Register user
// @route   POST /api/v1/auth/ register
//@access  Public

exports.register = asyncHandler(async (req, res, next) => {
    const {name , email, password , role} = req.body;

    //Create User
    const User  = await User.create({
        name,
        email,
        password,
        role
    })

    // Create Token
    const token = user.getSignedJWTToken();

    res.status(201).json({success : true, token});
})


//@desc  Login user
// @route   POST /api/v1/auth/login
//@access  Public

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password } = req.body;

    // Validate email and password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user  = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorResponse('Invalid credential', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid credential', 401));
    }

    // Send Token Response
    sendTokenResponse(user,200,res);
})

// Get token from model, create cookies and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.getSignedJWTToken();

    const options = {
        expires: new Date(Date.now + process.env.GWT_COOKIE_EXPIRE * 24 * 8 * 60 * 60 * 100),
        httpOnly : true
    }

    if(process.env.NODE_DEV === 'production'){
        options.secure = true;
    }

    res.status(statusCode)
    .cookie('token', token, options)
    .json({
        success : true,
        token
    })
}

//@desc  Get current login user
// @route   POST /api/v1/auth/me
//@access  Private

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
        data : user
    })
})