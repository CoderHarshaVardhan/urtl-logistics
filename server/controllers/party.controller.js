const Consignor = require('../models/Consignor.model');
const Consignee = require('../models/Consignee.model');

// ==========================================
// Consignor
// ==========================================

exports.createConsignor = async (req, res) => {
  try {
    const consignor = await Consignor.create(req.body);
    res.status(201).json({ success: true, data: consignor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.searchConsignors = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    const regex = new RegExp(query, 'i');
    const consignors = await Consignor.find({
      $or: [{ name: regex }, { mobile: regex }, { gstNo: regex }]
    }).limit(10);

    res.status(200).json({ success: true, data: consignors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ==========================================
// Consignee
// ==========================================

exports.createConsignee = async (req, res) => {
  try {
    const consignee = await Consignee.create(req.body);
    res.status(201).json({ success: true, data: consignee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.searchConsignees = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    const regex = new RegExp(query, 'i');
    const consignees = await Consignee.find({
      $or: [{ name: regex }, { mobile: regex }, { gstNo: regex }]
    }).limit(10);

    res.status(200).json({ success: true, data: consignees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
