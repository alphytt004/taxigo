import jwt from 'jsonwebtoken';

// Middleware to check if the user is authenticated with a valid JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Access denied, token required' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ✅ Correct export
export default authenticateJWT; // Default export
export { authenticateJWT }; // Named export (optional)

// const jwt = require('jsonwebtoken');

// // Middleware to check if the user is authenticated with a valid JWT token
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ error: 'Access denied, token required' });
//   }

//   jwt.verify(token, 'your_jwt_secret', (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// module.exports = {
//   authenticateJWT,
// };

