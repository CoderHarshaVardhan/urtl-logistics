const express = require('express');
const { getNextLRNumber, createLR, getAllLRs, getAvailableLRs, getLRById, updateLR } = require('../controllers/lr.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.get('/next-number', getNextLRNumber);
router.post('/', createLR);
router.get('/', getAllLRs);
router.get('/available', getAvailableLRs);
router.get('/:id', getLRById);
router.put('/:id', updateLR);

module.exports = router;
