// routes/dashboardRoutes.js
const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const path = require('path');
const router = express.Router();
// routes/dashboardRoutes.js


// Simulated patient data (replace this with real database queries in production)
const patients = [
    { id: 1, name: 'John Doe', age: 30, condition: 'Flu', date: '2024-10-01' },
    { id: 2, name: 'Jane Smith', age: 40, condition: 'Allergy', date: '2024-10-02' },
    // Add more records as needed
];

// Route to fetch all patient details (only for admins)
router.get('/patients', authenticate, authorizeAdmin, (req, res) => {
    res.json(patients);
});

module.exports = router;

// Admin Dashboard (only accessible to admin users)
router.get('/admin-dashboard', authenticate, authorizeAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin-dashboard.html'));
});

// User Dashboard (accessible to all authenticated users)
router.get('/user-dashboard', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user-dashboard.html'));
});

module.exports = router;
