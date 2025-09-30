// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the Feedback model
const Feedback = require('./models/Feedback');

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Test message to verify server started
console.log("✅ Server starting...");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Handle feedback form submission
app.post('/submit-feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(200).send('✅ Feedback submitted successfully!');
  } catch (error) {
    console.error('❌ Error while submitting feedback:', error);
    res.status(500).send('❌ Internal Server Error');
  }
});

// Start server on PORT 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
