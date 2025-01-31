const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/authRoutes');           // Authentication routes
const dashboardRoutes = require('./routes/dashboardRoutes'); // Dashboard routes
const { authenticate } = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'chinnu', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route handling
app.use(authRoutes);          // Authentication routes (login, logout)
app.use(dashboardRoutes);      // Dashboard routes (user and admin)
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Root route to check authentication and redirect
app.get('/', (req, res) => {
    if (req.session.user) {
        // If logged in, redirect to respective dashboard based on role
        if (req.session.user.role === 'admin') {
            res.redirect('/admin-dashboard');
        } else {
            res.redirect('/user-dashboard');
        }
    } else {
        // If not logged in, redirect to login page
        res.redirect('/login.html');
    }
});

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Chinnu@2904',
    database: 'HMSDB',
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Appointment route
app.post('/appointments', (req, res) => {
    const { patient_id, doctor_id, date, time } = req.body;

    // Check if patient_id exists
    db.query('SELECT * FROM patients WHERE patient_id = ?', [patient_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Invalid patient ID.');
        }

        // Check if doctor_id exists
        db.query('SELECT * FROM doctors WHERE doctor_id = ?', [doctor_id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).send('Invalid doctor ID.');
            }

            // Proceed with appointment insertion if both patient_id and doctor_id exist
            const query = 'INSERT INTO appointments (patient_id, doctor_id, date, time) VALUES (?, ?, ?, ?)';
            db.query(query, [patient_id, doctor_id, date, time], (err, result) => {
                if (err) {
                    console.error('Error inserting data into appointments:', err);
                    return res.status(500).send('Error processing request');
                }
                res.send('Appointment booked successfully');
            });
        });
    });
});

// Patient Management route
app.post('/patients', (req, res) => {
    const { name, dob, address, contact_details } = req.body;
    const query = 'INSERT INTO patients (name, dob, address, contact_details) VALUES (?, ?, ?, ?)';
    db.query(query, [name, dob, address, contact_details], (err, result) => {
        if (err) {
            console.error('Error inserting data into patients:', err);
            return res.status(500).send('Error processing patient data');
        }
        res.send('Patient added successfully');
    });
});

// Doctor Tools route
app.post('/doctors', (req, res) => {
    const { doctor_id, name, specialty, contact_details, department, schedule } = req.body;
    const query = `
        INSERT INTO doctors (doctor_id, name, specialty, contact_details, department, schedule)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            specialty = VALUES(specialty),
            contact_details = VALUES(contact_details),
            department = VALUES(department),
            schedule = VALUES(schedule)
    `;
    db.query(query, [doctor_id, name, specialty, contact_details, department, schedule], (err, result) => {
        if (err) {
            console.error('Error updating doctor data:', err);
            return res.status(500).send('Error processing doctor data');
        }
        res.send('Doctor information updated successfully');
    });
});

// Billing & Payments route
app.post('/billing', (req, res) => {
    const { patient_id, amount, status } = req.body;
    const query = 'INSERT INTO billing (patient_id, amount, status) VALUES (?, ?, ?)';
    db.query(query, [patient_id, amount, status], (err, result) => {
        if (err) {
            console.error('Error inserting data into billing:', err);
            return res.status(500).send('Error processing billing data');
        }
        res.send('Billing information recorded successfully');
    });
});

// Diagnostic Scheduling route
app.post('/diagnostics', (req, res) => {
    const { patient_id, test, date, time } = req.body;
    const query = 'INSERT INTO diagnostics (patient_id, test, date, time) VALUES (?, ?, ?, ?)';
    db.query(query, [patient_id, test, date, time], (err, result) => {
        if (err) {
            console.error('Error inserting data into diagnostics:', err);
            return res.status(500).send('Error processing diagnostic scheduling');
        }
        res.send('Diagnostic test scheduled successfully');
    });
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/login.html`);
});
