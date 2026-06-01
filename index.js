const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully! 🎉'))
  .catch(err => console.log('Database Connection Error: ❌', err));

// Base Route
app.get('/', (req, res) => {
  res.send('Drivefleet Server is running perfectly...');
});

// Server Listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});