// middleware/authMiddleware.js

// Middleware to check if user is logged in
function authenticate(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html'); // Redirect to login if not authenticated
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

module.exports = { authenticate, authorizeAdmin };
