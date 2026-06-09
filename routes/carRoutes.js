const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const verifyToken = require('../middlewares/authMiddleware');

// ১. Explore Cars with Search, Filter & Sorting (আপডেটেড চ্যালেঞ্জ)
router.get('/', async (req, res) => {
  try {
    const { search, carType, sort } = req.query; // 🚀 sort রিসিভ করা হচ্ছে
    let query = {};

    // Search by Car Name using $regex
    if (search) {
      query.carName = { $regex: search, $options: 'i' };
    }
    // Filter by Car Type (যদি 'all' না হয়)
    if (carType && carType !== 'all') {
      query.carType = carType;
    }

    // 🚀 নতুন চ্যালেঞ্জ: সর্টিং লজিক হ্যান্ডেল করা
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { dailyRent: 1 };
    else if (sort === 'price_desc') sortOption = { dailyRent: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else sortOption = { createdAt: -1 }; // ডিফল্ট লেটেস্ট গাড়ি আগে দেখাবে

    const cars = await Car.find(query).sort(sortOption);
    res.send(cars);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ২. Car Details
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.send(car);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ৩. Add Car (Private Route - আপডেটেড ক্যাচ ব্লক)
router.post('/', verifyToken, async (req, res) => {
  try {
    const carData = req.body;
    carData.createdAt = new Date();
    carData.bookingCount = 0; // ডিফল্ট বুকিং কাউন্ট ০ করা হলো
    
    const newCar = new Car(carData);
    const result = await newCar.save();
    res.send(result);
  } catch (error) {
    // 🚀 ফিক্সড: জাস্ট error.message না পাঠিয়ে পুরো এরর অবজেক্টটি পাঠানো হলো
    // যাতে মঙ্গুসের কোন ফিল্ডে ঝামেলা হচ্ছে (যেমন Validation Error) তা ফ্রন্টএন্ডে দেখা যায়।
    res.status(500).send({ 
      success: false, 
      message: error.message, 
      errors: error.errors ? Object.keys(error.errors) : null 
    });
  }
});

// ৪. Get My Added Cars (Private Route)
router.get('/my-cars/:email', verifyToken, async (req, res) => {
  try {
    if (req.user.email !== req.params.email) {
      return res.status(403).send({ message: 'Forbidden access' });
    }
    const myCars = await Car.find({ ownerEmail: req.params.email }).sort({ createdAt: -1 });
    res.send(myCars);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ৫. Update Car (Private Route)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ৬. Delete Car (Private Route)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Car.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;