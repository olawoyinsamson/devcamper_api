const mongoose = require('mongoose');
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_LOCAL_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.green.underline.bold)
}

module.exports = connectDB;