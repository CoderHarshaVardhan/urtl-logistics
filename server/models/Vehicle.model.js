const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    driverName: {
      type: String,
      required: [true, 'Driver Name is required'],
      trim: true,
    },
    driverPhone: {
      type: String,
      required: [true, 'Driver Phone number is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle Number is required'],
      trim: true,
      uppercase: true,
    },
    rcNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      trim: true,
    },
    driverLicense: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
