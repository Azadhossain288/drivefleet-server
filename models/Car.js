const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  carName: { type: String, required: true },
  dailyPrice: { type: Number, required: true },
  carType: { type: String, required: true }, // SUV, Sedan, Hatchback, Luxury
  imageUrl: { type: String, required: true },
  seatCapacity: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  availabilityStatus: { type: String, default: 'Available' }, // Available / Unavailable
  ownerEmail: { type: String, required: true },
  bookingCount: { type: Number, default: 0 } // Challenges: for $inc 
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);