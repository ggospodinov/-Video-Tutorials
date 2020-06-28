const mongoose = require('mongoose');
const { Schema, model: Model } = mongoose;
const { String, ObjectId, Boolean } = Schema.Types
const bcrypt= require('bcrypt');
const saltRounds=10;


const courseSchema = new Schema({

    
    title: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 50
    },

    imageUrl: {
        type: String,
        required: true
    },

    isPublic: {
        type: Boolean,
        required: true,
        default:false
    },

    createdAt: {
        type: String,
        required: true
    },

    usersEnrolled : [{
        type: ObjectId,
        ref: 'User'
    }],

    creator: {
        type: ObjectId,
        ref: 'User'
    }

});
module.exports = new Model('Course', courseSchema);