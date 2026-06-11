const mongoose = require('mongoose');

const consigneeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Consignee Name is required'],
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

const Consignee = mongoose.model('Consignee', consigneeSchema);
module.exports = Consignee;
