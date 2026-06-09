const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access: No token provided' });
  }

  // 🚀 ফিক্সড: এখানেও রাউটের মতো ডিফল্ট সিক্রেট কি বা ফলব্যাক দেওয়া হলো
  const secret = process.env.JWT_SECRET || 'secret-key-drivefleet';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access: Invalid token' });
    }
    req.user = decoded; 
    next();
  });
};

module.exports = verifyToken;