const mongoose = require('mongoose');
const slugify = require('slugify');

const BootcampSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please add a name'],
        unique: true,
        trim : true,
        maxlength : [50, "name cannot be more than 50 character"]
    },
    slug: String,
    description : {
        type : String,
        required : [true, "Please add a description"],
        maxLength : [500 , "Description can not be more than 500 character"]
    },
    website : {
        type : String,
        match: [/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/, "Please use a valid URL with HTTP or HTTPS"]
    },
    phone : {
        type: String,
        maxLength : [20, 'Phone number can not be londer than 20 character']
    },
    email : {
        type : String,
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ , 'Please add a valid email']
    },
    address: {
        type: String,
        required: [true , 'Please add in an address']
    },
    location: {
        type: {
            type : String,
            enum: ['Point'],
            required : true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        },
        formattedAddress : String,
        street: String,
        city: String,
        zipcode: String,
        country: String
    },
    careers : {
        type : [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type : Number,
        min : [1 , 'Rating must be atleast 1'],
        max : [10, 'Reating must can not be more than 10']
    },
    averageCOST : Number,
    photo : {
        type : String,
        default: 'no-photo.jpg'
    },
    housing : {
        type: Boolean,
        default : false
    },
    jobAssistance: {
        type: Boolean,
        default : false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type : Boolean,
        default : false
    },
    createDate : {
        type : Date,
        default : Date.now
    }
});

// Create bootcamp slug from the name
BootcampSchema.pre('save', function(next){
    this.slug = slugify(this.name,{lower:true})
    console.log('slugigy ran', this.name);
    next();
})

module.exports = mongoose.model('Bootcamp',BootcampSchema);