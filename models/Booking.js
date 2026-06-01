const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  userEmail: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now },
  driverNeeded: { type: String, enum: ['Yes', 'No'], required: true },
  specialNote: { type: String },
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);