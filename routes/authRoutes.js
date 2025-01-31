// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Simulated user data (replace with a real database in production)
const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user1', password: 'user123', role: 'user' },
];

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = { username: user.username, role: user.role };
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

module.exports = router;
