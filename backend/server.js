const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const schedulerRoutes = require('./routes/schedulerRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
  }),
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', schedulerRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'CPU Scheduler API is running' });
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
