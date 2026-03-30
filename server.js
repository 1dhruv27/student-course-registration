require('dotenv').config(); // This MUST be the very first line
const express = require('express');
const mongoose = require('mongoose'); // We need mongoose to connect
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 2. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' MongoDB Connected to Main Server!'))
    .catch(err => {
        console.error('❌ Database connection error:', err.message);
        process.exit(1);
    });

// 3. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

// 4. Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});