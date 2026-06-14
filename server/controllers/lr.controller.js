const { LR_AN, LR_VZ } = require('../models/LR.model');
const BranchCounter = require('../models/BranchCounter.model');

// Helper to get branch prefix
const getBranchPrefix = (branchName) => {
  const branchMap = {
    'Auto Nagar': 'AN',
    'Vizag': 'VZ'
  };
  return branchMap[branchName] || 'AN'; // Default to AN if not found
};

const getModelForBranch = (branchName) => {
  return getBranchPrefix(branchName) === 'VZ' ? LR_VZ : LR_AN;
};

exports.getNextLRNumber = async (req, res) => {
  try {
    const branchName = req.user.branch;
    if (!branchName) {
      return res.status(400).json({ message: 'User branch not found' });
    }

    const prefix = getBranchPrefix(branchName);

    // Only read the counter, do not increment
    let counter = await BranchCounter.findOne({ branchCode: prefix });

    // If it doesn't exist, create it starting explicitly at 10001
    if (!counter) {
      counter = await BranchCounter.create({ 
        branchCode: prefix, 
        lastSequence: 1000 
      });
    }

    const nextLRNumber = `${prefix}${counter.lastSequence}`;

    res.status(200).json({
      success: true,
      lrNumber: nextLRNumber,
      branch: branchName
    });
  } catch (error) {
    console.error('Error generating LR number:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createLR = async (req, res) => {
  try {
    const {
      lrNumber,
      branch,
      date,
      fromPlace,
      toPlace,
      consignor,
      consignee,
      invoiceNo,
      ewayBillNumber,
      payType,
      remarks,
      declaredValue,
      items,
      charges,
      totalAmount
    } = req.body;

    const prefix = getBranchPrefix(req.user.branch);

    let assignedLRNumber = lrNumber;

    if (!assignedLRNumber) {
      // Atomically increment the sequence and get the value BEFORE increment
      const counter = await BranchCounter.findOneAndUpdate(
        { branchCode: prefix },
        { $inc: { lastSequence: 1 } },
        { returnDocument: 'before' }
      );

      if (!counter) {
        return res.status(500).json({ message: 'Branch counter not initialized properly.' });
      }

      assignedLRNumber = `${prefix}${counter.lastSequence}`;
    } else {
      // User provided an lrNumber. Try to increment the counter only if it matches the expected current sequence.
      if (assignedLRNumber.startsWith(prefix)) {
        const seqMatch = assignedLRNumber.substring(prefix.length);
        const seqNum = parseInt(seqMatch, 10);
        if (!isNaN(seqNum)) {
          // Atomically increment ONLY IF the lastSequence in the DB matches this seqNum.
          await BranchCounter.findOneAndUpdate(
            { branchCode: prefix, lastSequence: seqNum },
            { $inc: { lastSequence: 1 } }
          );
        }
      }
    }

    const LRModel = getModelForBranch(req.user.branch || branch);
    const newLR = await LRModel.create({
      lrNumber: assignedLRNumber,
      branch: req.user.branch || branch,
      date,
      fromPlace,
      toPlace,
      consignor,
      consignee,
      invoiceNo,
      ewayBillNumber,
      payType,
      remarks,
      declaredValue,
      items,
      charges,
      totalAmount,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      lr: newLR
    });
  } catch (error) {
    console.error('Error creating LR:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'LR Number already exists. Please change the number as it is already present.' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Get all LRs for the user's branch
exports.getAllLRs = async (req, res) => {
  try {
    const LRModel = getModelForBranch(req.user.branch);
    
    const query = { branch: req.user.branch };
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const lrs = await LRModel.find(query)
      .sort({ createdAt: -1 })
      .populate('consignor', 'name mobile')
      .populate('consignee', 'name mobile')
      .lean();

    res.status(200).json({
      success: true,
      count: lrs.length,
      data: lrs
    });
  } catch (error) {
    console.error('Error fetching LRs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get single LR by ID
exports.getLRById = async (req, res) => {
  try {
    let lr = await LR_AN.findById(req.params.id)
      .populate('consignor')
      .populate('consignee')
      .lean();

    if (!lr) {
      lr = await LR_VZ.findById(req.params.id)
        .populate('consignor')
        .populate('consignee')
        .lean();
    }

    if (!lr) {
      return res.status(404).json({ message: 'Lorry Receipt not found' });
    }

    // Ensure user has access to this LR's branch
    if (lr.branch !== req.user.branch && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this LR' });
    }

    res.status(200).json({
      success: true,
      data: lr
    });
  } catch (error) {
    console.error('Error fetching LR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update an existing LR
exports.updateLR = async (req, res) => {
  try {
    let lr = await LR_AN.findById(req.params.id);
    let LRModel = LR_AN;

    if (!lr) {
      lr = await LR_VZ.findById(req.params.id);
      LRModel = LR_VZ;
    }

    if (!lr) {
      return res.status(404).json({ message: 'Lorry Receipt not found' });
    }

    // Ensure user has access
    if (lr.branch !== req.user.branch && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this LR' });
    }

    // Don't allow changing the branch once created
    const { branch, ...updateData } = req.body;

    lr = await LRModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: lr
    });
  } catch (error) {
    console.error('Error updating LR:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'LR Number already exists. Please change the number as it is already present.' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Get all available LRs (not yet loaded)
exports.getAvailableLRs = async (req, res) => {
  try {
    const LRModel = getModelForBranch(req.user.branch);
    
    // Query LRs where isLoaded is false or doesn't exist
    const query = { 
      branch: req.user.branch,
      $or: [ { isLoaded: false }, { isLoaded: { $exists: false } } ]
    };

    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const lrs = await LRModel.find(query)
      .sort({ createdAt: -1 })
      .populate('consignor', 'name')
      .populate('consignee', 'name')
      .lean();

    res.status(200).json({
      success: true,
      count: lrs.length,
      data: lrs
    });
  } catch (error) {
    console.error('Error fetching available LRs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Public tracking
exports.trackLR = async (req, res) => {
  try {
    const { lrNumber } = req.params;
    
    // Search in both collections
    let lr = await LR_AN.findOne({ lrNumber: new RegExp('^' + lrNumber + '$', 'i') })
      .populate('consignor', 'name')
      .populate('consignee', 'name')
      .lean();

    if (!lr) {
      lr = await LR_VZ.findOne({ lrNumber: new RegExp('^' + lrNumber + '$', 'i') })
        .populate('consignor', 'name')
        .populate('consignee', 'name')
        .lean();
    }

    if (!lr) {
      return res.status(404).json({ success: false, message: 'Lorry Receipt not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        lrNumber: lr.lrNumber,
        fromPlace: lr.fromPlace,
        toPlace: lr.toPlace,
        consignorName: lr.consignor?.name || 'N/A',
        consigneeName: lr.consignee?.name || 'N/A',
        status: lr.status || 'Dispersed',
        date: lr.date
      }
    });
  } catch (error) {
    console.error('Error tracking LR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
