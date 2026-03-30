const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    instructor: {
        type: String,
        required: [true, 'Please add an instructor name']
    },
    capacity: {
        type: Number,
        required: [true, 'Please specify the maximum capacity']
    },
    enrolledCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);