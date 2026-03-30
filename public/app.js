// --- DOM Elements ---
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const courseList = document.getElementById('course-list');

// State variable to hold the logged-in student's ID
let currentStudentId = null; 

// --- 1. Handle Registration ---
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent standard page reload
    
    // Gather data
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const messageEl = document.getElementById('reg-message');

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageEl.style.color = 'green';
            messageEl.textContent = 'Registration successful! You can now log in.';
            registerForm.reset();
        } else {
            messageEl.style.color = 'red';
            messageEl.textContent = data.message;
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
});

// --- 2. Handle Login ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById('login-message');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save student ID and switch UI
            currentStudentId = data.studentId; 
            authSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            loadCourses(); // Fetch courses from the database
        } else {
            messageEl.style.color = 'red';
            messageEl.textContent = data.message;
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});

// --- 3. Fetch and Display Courses ---
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        
        courseList.innerHTML = ''; // Clear existing content

        courses.forEach(course => {
            // Dynamic content generation using DOM API
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            
            courseCard.innerHTML = `
                <div class="course-info">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p><strong>Enrolled:</strong> ${course.enrolledCount} / ${course.capacity}</p>
                </div>
                <button class="enroll-btn" onclick="enrollCourse('${course._id}')">Enroll</button>
            `;
            
            courseList.appendChild(courseCard);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// --- 4. Handle Enrollment ---
async function enrollCourse(courseId) {
    try {
        const response = await fetch('/api/courses/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: currentStudentId, courseId: courseId })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Success
            loadCourses(); // Refresh the course list to update capacities
        } else {
            alert(data.message); // Failed (e.g., already enrolled or full)
        }
    } catch (error) {
        console.error('Enrollment error:', error);
    }
}