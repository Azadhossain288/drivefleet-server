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
        secure: true,      
        sameSite: 'none',  
      })
      .send({ success: true });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ২. logout and clear cookie
router.post('/logout', async (req, res) => {
  try {
    res
      .clearCookie('token', {
        secure: true,      
        sameSite: 'none',  
      })
      .send({ success: true });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;