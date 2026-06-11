const mongoose = require('mongoose');

const branchCounterSchema = new mongoose.Schema(
  {
    branchCode: {
      type: String,
      required: true,
      unique: true,
      enum: ['AN', 'VZ'], // Auto Nagar, Vizag
    },
    lastSequence: {
      type: Number,
      required: true,
      default: 1000, // Sequence starts from 1001
    },
  },
  { timestamps: true }
);

const BranchCounter = mongoose.model('BranchCounter', branchCounterSchema);
module.exports = BranchCounter;
