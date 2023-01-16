const express = require('express');
const dotenv = require('dotenv');
const bootcampsRoute = require('./routes/bootcamps');
const coursesRoute = require('./routes/courses');
const authRoute = require('./routes/auth');
const logger = require('./middleware/logger');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const express_fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');

//Load env file
dotenv.config({path : './config/config.env'});

// Connect DB
connectDB();

const app = express();

//Body parser
app.use(express.json());

app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname,'public')))

// File Upload
app.use(express_fileupload)

app.use(logger);

//Connect app route

app.use('/api/v1/bootcamps',bootcampsRoute);
app.use('/api/v1/courses',coursesRoute);
app.use('/api/v1/auth', authRoute);

//Link error handle middleware
app.use(errorHandler);


const PORT  = process.env.PORT || 5000;

const server = app.listen(PORT, () =>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.underline.bold);
})

//Handled unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exist process
    server.close(() => process.exit(1));
})