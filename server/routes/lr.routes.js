const express = require('express');
const { getNextLRNumber, createLR, getAllLRs, getAvailableLRs, getLRById, updateLR, trackLR } = require('../controllers/lr.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public Tracking Route
router.get('/track/:lrNumber', trackLR);

// Apply auth middleware to all other routes
router.use(protect);

router.get('/next-number', getNextLRNumber);
router.post('/', createLR);
router.get('/', getAllLRs);
router.get('/available', getAvailableLRs);
router.get('/:id', getLRById);
router.put('/:id', updateLR);

module.exports = router;
