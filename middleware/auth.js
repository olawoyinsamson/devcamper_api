const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncAwait');
const User = require('../models/User')
const ErrorResponse = require('../util/errorResponse');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookie.token){
        token  = req.cookie.token;
    }

    // Make sure token exists
    if(!token){
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }
})