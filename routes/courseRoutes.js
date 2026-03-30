const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Student = require('../models/Student');

// GET /api/courses - View all available courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/courses/enroll - Enroll a student in a course
router.post('/enroll', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // 1. Find the student and the course
        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!student || !course) {
            return res.status(404).json({ message: 'Student or Course not found' });
        }

        // 2. Validation checks
        if (student.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }
        if (course.enrolledCount >= course.capacity) {
            return res.status(400).json({ message: 'This course is at maximum capacity' });
        }

        // 3. Perform the update (CRUD operation)
        student.enrolledCourses.push(courseId);
        await student.save();

        course.enrolledCount += 1;
        await course.save();

        res.status(200).json({ message: `Successfully enrolled in ${course.title}!` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;