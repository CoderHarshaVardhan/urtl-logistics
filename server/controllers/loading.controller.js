const Loading = require('../models/Loading.model');
const LoadingCounter = require('../models/LoadingCounter.model');
const { LR_AN, LR_VZ } = require('../models/LR.model');

const getBranchPrefix = (branchName) => {
  const branchMap = {
    'Auto Nagar': '36AN',
    'Vizag': '36VZ'
  };
  return branchMap[branchName] || '36AN'; 
};

exports.getNextLoadingNumber = async (req, res) => {
  try {
    const branchName = req.user.branch;
    if (!branchName) {
      return res.status(400).json({ message: 'User branch not found' });
    }

    const prefix = getBranchPrefix(branchName);

    let counter = await LoadingCounter.findOne({ branchCode: prefix });

    if (!counter) {
      counter = await LoadingCounter.create({ 
        branchCode: prefix, 
        lastSequence: 1000 
      });
    }

    const nextNumber = `${prefix}${counter.lastSequence}`;

    res.status(200).json({
      success: true,
      loadingNumber: nextNumber,
      branch: branchName
    });
  } catch (error) {
    console.error('Error generating Loading number:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createLoading = async (req, res) => {
  try {
    const {
      loadingNumber,
      branch,
      date,
      fromPlace,
      toPlace,
      vehicle,
      lrs
    } = req.body;

    const prefix = getBranchPrefix(req.user.branch);

    let assignedNumber = loadingNumber;

    if (!assignedNumber) {
      const counter = await LoadingCounter.findOneAndUpdate(
        { branchCode: prefix },
        { $inc: { lastSequence: 1 } },
        { returnDocument: 'before' }
      );

      if (!counter) {
        return res.status(500).json({ message: 'Branch counter not initialized properly.' });
      }

      assignedNumber = `${prefix}${counter.lastSequence}`;
    } else {
      if (assignedNumber.startsWith(prefix)) {
        const seqMatch = assignedNumber.substring(prefix.length);
        const seqNum = parseInt(seqMatch, 10);
        if (!isNaN(seqNum)) {
          await LoadingCounter.findOneAndUpdate(
            { branchCode: prefix, lastSequence: seqNum },
            { $inc: { lastSequence: 1 } }
          );
        }
      }
    }

    const newLoading = await Loading.create({
      loadingNumber: assignedNumber,
      branch: req.user.branch || branch,
      date,
      fromPlace,
      toPlace,
      vehicle,
      lrs,
      createdBy: req.user._id
    });

    // Mark the selected LRs as loaded
    if (lrs && lrs.length > 0) {
      const lrIds = lrs.map(lr => lr.lrId);
      const LRModel = getBranchPrefix(req.user.branch) === '36VZ' ? LR_VZ : LR_AN;
      
      await LRModel.updateMany(
        { _id: { $in: lrIds } },
        { $set: { isLoaded: true } }
      );
    }

    res.status(201).json({
      success: true,
      loading: newLoading
    });
  } catch (error) {
    console.error('Error creating Loading:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Loading Number already exists. Please change the number as it is already present.' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

exports.getAllLoadings = async (req, res) => {
  try {
    const query = { branch: req.user.branch };
    
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const loadings = await Loading.find(query)
      .sort({ createdAt: -1 })
      .populate('vehicle')
      .lean();

    res.status(200).json({
      success: true,
      count: loadings.length,
      data: loadings
    });
  } catch (error) {
    console.error('Error fetching Loadings:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getLoadingById = async (req, res) => {
  try {
    const loading = await Loading.findById(req.params.id)
      .populate('vehicle')
      .lean();

    if (!loading) {
      return res.status(404).json({ message: 'Loading sheet not found' });
    }

    // Ensure user has access
    if (req.user.role !== 'admin' && loading.branch !== req.user.branch) {
      return res.status(403).json({ message: 'Not authorized to access this loading sheet' });
    }

    // Populate LRs manually
    if (loading.lrs && loading.lrs.length > 0) {
      const lrIds = loading.lrs.map(lr => lr.lrId);
      const LRModel = getBranchPrefix(loading.branch) === '36VZ' ? LR_VZ : LR_AN;
      
      const fullLRs = await LRModel.find({ _id: { $in: lrIds } })
        .populate('consignor', 'name')
        .populate('consignee', 'name')
        .lean();
      
      loading.fullLRs = fullLRs;
    }

    res.status(200).json({
      success: true,
      data: loading
    });
  } catch (error) {
    console.error('Error fetching Loading:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateLoading = async (req, res) => {
  try {
    const { loadingNumber, vehicle, lrs, fromPlace, toPlace, date } = req.body;
    
    let loading = await Loading.findById(req.params.id);

    if (!loading) {
      return res.status(404).json({ message: 'Loading sheet not found' });
    }

    // Ensure user has access
    if (req.user.role !== 'admin' && loading.branch !== req.user.branch) {
      return res.status(403).json({ message: 'Not authorized to update this loading sheet' });
    }

    // We need to handle LR isLoaded flags if LRs change.
    // For simplicity, we first un-mark all old LRs, then mark the new ones.
    const LRModel = getBranchPrefix(req.user.branch) === '36VZ' ? LR_VZ : LR_AN;

    if (loading.lrs && loading.lrs.length > 0) {
      const oldLrIds = loading.lrs.map(lr => lr.lrId);
      await LRModel.updateMany(
        { _id: { $in: oldLrIds } },
        { $set: { isLoaded: false } }
      );
    }

    if (lrs && lrs.length > 0) {
      const newLrIds = lrs.map(lr => lr.lrId);
      await LRModel.updateMany(
        { _id: { $in: newLrIds } },
        { $set: { isLoaded: true } }
      );
    }

    if (loadingNumber) {
      loading.loadingNumber = loadingNumber;
    }
    loading.vehicle = vehicle;
    loading.lrs = lrs;
    loading.fromPlace = fromPlace;
    loading.toPlace = toPlace;
    loading.date = date;

    await loading.save();

    res.status(200).json({
      success: true,
      data: loading
    });
  } catch (error) {
    console.error('Error updating Loading:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Loading Number already exists. Please change the number as it is already present.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};
