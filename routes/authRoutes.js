const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Token Create on Login/Register
router.post('/jwt', async (req, res) => {
  const user = req.body; // { email }
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // Vercel/Render-Deployment true
    sameSite: 'none'
  }).send({ success: true });
});

// Logout (Clear Cookie)
router.post('/logout', async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  }).send({ success: true });
});

module.exports = router;