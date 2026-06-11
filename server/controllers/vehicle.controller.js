const Vehicle = require('../models/Vehicle.model');

// Create a new Vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { driverName, driverPhone, vehicleNumber, rcNumber, vehicleType, driverLicense } = req.body;

    const newVehicle = await Vehicle.create({
      driverName,
      driverPhone,
      vehicleNumber,
      rcNumber,
      vehicleType,
      driverLicense,
    });

    res.status(201).json({
      success: true,
      data: newVehicle
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Vehicle already exists.' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Search Vehicles
exports.searchVehicles = async (req, res) => {
  try {
    const { query } = req.query;
    let searchCriteria = {};

    if (query) {
      searchCriteria = {
        $or: [
          { vehicleNumber: { $regex: query, $options: 'i' } },
          { driverName: { $regex: query, $options: 'i' } },
          { driverPhone: { $regex: query, $options: 'i' } }
        ]
      };
    }

    const vehicles = await Vehicle.find(searchCriteria)
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Error searching vehicles:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
