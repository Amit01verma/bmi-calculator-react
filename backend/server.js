const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bmiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Define Schema (structure of a record)
const bmiSchema = new mongoose.Schema({
  weight: Number,
  height: Number,
  bmi: Number,
  category: String,
  date: { type: Date, default: Date.now }
});

// Create a model
const BmiRecord = mongoose.model('BmiRecord', bmiSchema);

// Route to calculate & save BMI
app.post('/api/bmi', async (req, res) => {
  const { weight, height } = req.body;

  if (!weight || !height) {
    return res.status(400).json({ message: 'Weight and height are required.' });
  }

  const heightInMeters = height / 100;
  const bmiValue = weight / (heightInMeters * heightInMeters);

  let category = '';
  if (bmiValue < 18.5) category = 'Underweight';
  else if (bmiValue < 24.9) category = 'Normal weight';
  else if (bmiValue < 29.9) category = 'Overweight';
  else category = 'Obesity';

  const newRecord = new BmiRecord({
    weight,
    height,
    bmi: bmiValue,
    category
  });

  await newRecord.save();

  res.json({
    bmi: bmiValue,
    category,
    date: newRecord.date
  });
});

// Route to get history
app.get('/api/history', async (req, res) => {
  const records = await BmiRecord.find().sort({ date: -1 });
  res.json(records);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
