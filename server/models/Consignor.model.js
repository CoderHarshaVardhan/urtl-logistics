const mongoose = require('mongoose');

const consignorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Consignor Name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    gstNo: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

const Consignor = mongoose.model('Consignor', consignorSchema);
module.exports = Consignor;
