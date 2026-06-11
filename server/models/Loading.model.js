const mongoose = require('mongoose');

const loadingSchema = new mongoose.Schema(
  {
    loadingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    fromPlace: {
      type: String,
      required: true,
      trim: true,
    },
    toPlace: {
      type: String,
      required: true,
      trim: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    lrs: [
      {
        lrId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          // Ref can be dynamic based on the LR type, but in Mongoose, it's safer to not strictly set a single ref if there are multiple models,
          // or we can just rely on the ObjectId and query the specific model based on the branch.
        },
        lrNumber: {
          type: String,
          required: true,
        }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Loading = mongoose.model('Loading', loadingSchema);
module.exports = Loading;
