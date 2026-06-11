const express = require('express');
const {
  createConsignor,
  searchConsignors,
  createConsignee,
  searchConsignees
} = require('../controllers/party.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

// Consignors
router.post('/consignors', createConsignor);
router.get('/consignors/search', searchConsignors);

// Consignees
router.post('/consignees', createConsignee);
router.get('/consignees/search', searchConsignees);

module.exports = router;
