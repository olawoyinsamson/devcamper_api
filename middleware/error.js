const ErrorResponse = require('../util/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    let message = "";
    // Log to console for developer
    console.log(err.stack.red);
    console.log(err.name);
    if(err.name === "CastError" ){

            message = `The bootcamp id ${err.value} does not exist`;
            error = new ErrorResponse(message, 404);
        }

    if(err.code === 11000){
            message = `The bootcamp duplicate key exist`;
            error = new ErrorResponse(message, 400);                
    }

    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success : false,
        error : error.message || 'Server error'
    })
}

module.exports = errorHandler;