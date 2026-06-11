const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const lrRoutes = require('../lr.routes');
const partyRoutes = require('../party.routes');
const vehicleRoutes = require('../vehicle.routes');
const loadingRoutes = require('../loading.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/lrs', lrRoutes);
router.use('/parties', partyRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/loadings', loadingRoutes);

module.exports = router;
