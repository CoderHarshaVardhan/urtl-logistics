const mongoose = require('mongoose');

const lrItemSchema = new mongoose.Schema({
  article: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  actualWeight: { type: Number, required: true },
  chargedWeight: { type: Number, required: true },
});

const lrSchema = new mongoose.Schema(
  {
    lrNumber: {
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
    consignor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consignor',
      required: true,
    },
    consignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consignee',
      required: true,
    },
    invoiceNo: {
      type: String,
      trim: true,
    },
    ewayBillNumber: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    payType: {
      type: String,
      enum: ['To Pay', 'Paid', 'FOC'],
      default: 'To Pay'
    },
    declaredValue: {
      type: Number,
      required: true,
      min: 0,
    },
    items: [lrItemSchema],
    charges: {
      freight: { type: Number, default: 0 },
      lrCharge: { type: Number, default: 0 },
      articleCharge: { type: Number, default: 0 },
      onlineCharge: { type: Number, default: 0 },
      doorDelivery: { type: Number, default: 0 },
      handling: { type: Number, default: 0 },
      valueSurCharge: { type: Number, default: 0 },
      gst: { type: Number, default: 0 },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isLoaded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const LR_AN = mongoose.model('LR_AN', lrSchema);
const LR_VZ = mongoose.model('LR_VZ', lrSchema);

module.exports = {
  LR_AN,
  LR_VZ
};
