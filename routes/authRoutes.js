const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// ১. create token and set cookie (JWT)
router.post('/jwt', async (req, res) => {
  try {
    const user = req.body;
    
    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret-key-drivefleet', { expiresIn: '7d' });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
      .send({ success: true });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


router.post('/logout', async (req, res) => {
  try {
    res
      .clearCookie('token', {
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
      .send({ success: true });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;