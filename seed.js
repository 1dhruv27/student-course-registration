const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');

// Load environment variables from .env
dotenv.config();

const sampleCourses = [
    {
        title: "Introduction to HTML, CSS, and JS",
        description: "Learn the basics of frontend web development.",
        instructor: "Prof. Alan Turing",
        capacity: 30
    },
    {
        title: "Advanced Node.js & Express",
        description: "Master backend routing and API creation.",
        instructor: "Dr. Grace Hopper",
        capacity: 25
    },
    {
        title: "MongoDB for Beginners",
        description: "Understanding NoSQL databases and CRUD operations.",
        instructor: "Prof. Ada Lovelace",
        capacity: 20
    }
];

const seedDB = async () => {
    try {
        console.log(`Attempting to connect to: ${process.env.MONGO_URI}`);
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!');

        // Clear existing courses and insert new ones
        await Course.deleteMany();
        await Course.insertMany(sampleCourses);
        console.log('✅ Sample courses added!');

        process.exit();
    } catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();