const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  processId: { type: String, required: true },
  arrivalTime: { type: Number, required: true, min: 0 },
  burstTime: { type: Number, required: true, min: 1 }
});

const processSetSchema = new mongoose.Schema({
  processes: {
    type: [processSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'At least one process is required'
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProcessSet', processSetSchema);
