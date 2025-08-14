// Requires authentication middleware
// This middleware checks for a valid JWT token in the Authorization header
// If the token is valid, it decodes the user information and attaches it to the request
import jwt from 'jsonwebtoken';

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ 
      message: 'Invalid or expired token',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};

export default auth;