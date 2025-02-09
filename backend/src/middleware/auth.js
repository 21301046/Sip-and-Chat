const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.adminToken || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin || false;

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};