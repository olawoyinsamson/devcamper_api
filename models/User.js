const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, 'Please add a name']
    },
    email: {
        type : String,
        required : [true, 'Please add an email'],
        unique: true,
        match: [/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/, "Please add a valid email"]
    },
    role : {
        type : String,
        enum : ['user','publisher'],
        default : 'user'
    },
    password: {
        type : String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordDate : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
})

UserSchema.pre('save', async function(next){
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);

    next();
})

// Sign JWT and return
UserSchema.methods.getSignedJWTToken = function (){
    return jwt.sign({id : this._id}, process.env.GWT_SECRET,{expiresIn : process.env.JWT_EXPIRE});
}

//Match user enter password to hash password in database
UserSchema.methods.matchPassword = async function (enteredPassword){
    return await bycrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);