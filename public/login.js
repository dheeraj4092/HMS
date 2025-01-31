const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'admin', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
}));
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Simulated user data (replace with database in production)
const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user1', password: 'user123', role: 'user' },
];

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body; // Removed role from here
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = { username: user.username, role: user.role };
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Middleware to check if user is logged in
function authenticate(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(403).json({ message: 'Not authenticated' });
    }
}

// Middleware to check if user is admin
function authorizeAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access only' });
    }
}
