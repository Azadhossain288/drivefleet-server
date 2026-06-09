const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const verifyToken = require('../middlewares/authMiddleware');

// ১. Book a Car (Private Route & Challenge $inc + Availability Update)
router.post('/', verifyToken, async (req, res) => {
  try {
    const bookingData = req.body;
    bookingData.bookingDate = new Date();
    
    const newBooking = new Booking(bookingData);
    await newBooking.save();

    // 🚀 আপডেটেড চ্যালেঞ্জ: বুকিং কাউন্ট ১ বাড়ানো এবং গাড়িকে Unavailable করা
    await Car.findByIdAndUpdate(bookingData.carId, {
      $inc: { bookingCount: 1 },
      $set: { availability: 'Unavailable' }
    });

    res.status(201).send({ success: true, message: 'Booking Successful!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ২. Get My Bookings (Private Route)
router.get('/:email', verifyToken, async (req, res) => {
  try {
    if (req.user.email !== req.params.email) {
      return res.status(403).send({ message: 'Forbidden access' });
    }
    const bookings = await Booking.find({ userEmail: req.params.email }).populate('carId');
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 🚀 ৩. Cancel/Delete Booking (Private Route - নতুন চ্যালেঞ্জ রিকোয়েস্ট থেকে যুক্ত করা হলো)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    // বুকিং ডেটা থেকে carId খুঁজে বের করা
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).send({ message: 'Booking not found' });
    }

    // গাড়িটিকে পুনরায় "Available" মুডে ফিরিয়ে নেওয়া
    if (booking?.carId) {
      await Car.findByIdAndUpdate(booking.carId, {
        $set: { availability: 'Available' }
      });
    }

    // বুকিং রেকর্ড মুছে ফেলা
    const result = await Booking.findByIdAndDelete(id);
    res.send({ success: true, message: 'Booking Canceled Successfully!', result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;