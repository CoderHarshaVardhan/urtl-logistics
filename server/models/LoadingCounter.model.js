const mongoose = require('mongoose');

const loadingCounterSchema = new mongoose.Schema(
  {
    branchCode: {
      type: String,
      required: true,
      unique: true,
      enum: ['36AN', '36VZ'], // Prefix for Auto Nagar and Vizag
    },
    lastSequence: {
      type: Number,
      required: true,
      default: 1000, // Sequence starts from 1000, so first is 1001 or 1000. Let's make default 999 if we want 1000 to be first, but if code increments then default: 999.
    },
  },
  { timestamps: true }
);

const LoadingCounter = mongoose.model('LoadingCounter', loadingCounterSchema);
module.exports = LoadingCounter;
