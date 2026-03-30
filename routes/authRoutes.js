const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// POST /api/auth/register - Register a new student
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if the student already exists
        const studentExists = await Student.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists with this email' });
        }

        // Create the new student document
        const student = await Student.create({ name, email, password });
        res.status(201).json({ 
            message: 'Registration successful', 
            studentId: student._id,
            name: student.name
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/login - Student login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find student by email and password (keeping it simple as per problem statement)
        const student = await Student.findOne({ email, password });
        
        if (!student) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            studentId: student._id, 
            name: student.name 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;