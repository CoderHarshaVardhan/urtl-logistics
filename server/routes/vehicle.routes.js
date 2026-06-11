const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', vehicleController.createVehicle);
router.get('/search', vehicleController.searchVehicles);

module.exports = router;
