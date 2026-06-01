const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const verifyToken = require('../middlewares/authMiddleware');

// ১. Book a Car (Private Route & Challenge $inc)
router.post('/', verifyToken, async (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = new Booking(bookingData);
    await newBooking.save();

    // Challenge: Use $inc to increase booking_count
    await Car.findByIdAndUpdate(bookingData.carId, {
      $inc: { bookingCount: 1 }
    });

    res.status(201).send({ success: true, message: 'Booking Successful!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ২. Get My Bookings (Private Route)
router.get('/:email', verifyToken, async (req, res) => {
  if (req.user.email !== req.params.email) {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  // populate() 
  const bookings = await Booking.find({ userEmail: req.params.email }).populate('carId');
  res.send(bookings);
});

module.exports = router;