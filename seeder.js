const fs = require("fs");
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

const path = './_data/bootcamps.json';
const course_path = './_data/courses.json';
const connectDB = require('./config/db');

//Load Model
const Bootcamp = require("./models/Bootcamp");
const Course = require('./models/Courses');

// Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/bootcamps',{
    useNewUrlParser: true
}).then(() => {
    console.log('DB Connected')
});

// Read JSON file
const bootcamps = JSON.parse(fs.readFileSync(path));
const course = JSON.parse(fs.readFileSync(course_path));

// Import into DB
const importData = async () => {
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(course);

        console.log('Data import ....'.green.inverse);
        console.log('Data import ....'.cyan.inverse);
        process.exit();
    } catch(err){
        console.error(err);
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await  Course.deleteMany();

        console.log('Data Destroyed...'.red.inverse);
        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(err);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}

