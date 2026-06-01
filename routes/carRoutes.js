const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const verifyToken = require('../middlewares/authMiddleware');

// ১. Explore Cars with Search & Filter
router.get('/', async (req, res) => {
  try {
    const { search, carType } = req.query;
    let query = {};

    // Challenge: Search by Car Name using $regex
    if (search) {
      query.carName = { $regex: search, $options: 'i' };
    }
    // Challenge: Filter by Car Type
    if (carType) {
      query.carType = carType;
    }

    const cars = await Car.find(query);
    res.send(cars);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ২. Car Details
router.get('/:id', async (req, res) => {
  const car = await Car.findById(req.params.id);
  res.send(car);
});

// ৩. Add Car (Private Route)
router.post('/', verifyToken, async (req, res) => {
  const newCar = new Car(req.body);
  const result = await newCar.save();
  res.send(result);
});

// ৪. Get My Added Cars (Private Route)
router.get('/my-cars/:email', verifyToken, async (req, res) => {
  if (req.user.email !== req.params.email) {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  const myCars = await Car.find({ ownerEmail: req.params.email });
  res.send(myCars);
});

// ৫. Update Car (Private Route)
router.put('/:id', verifyToken, async (req, res) => {
  const result = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(result);
});

// ৬. Delete Car (Private Route)
router.delete('/:id', verifyToken, async (req, res) => {
  const result = await Car.findByIdAndDelete(req.params.id);
  res.send(result);
});

module.exports = router;