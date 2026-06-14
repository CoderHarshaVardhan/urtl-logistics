const express = require('express');
const {
  createConsignor,
  searchConsignors,
  updateConsignor,
  createConsignee,
  searchConsignees,
  updateConsignee
} = require('../controllers/party.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

// Consignors
router.post('/consignors', createConsignor);
router.get('/consignors/search', searchConsignors);
router.put('/consignors/:id', updateConsignor);

// Consignees
router.post('/consignees', createConsignee);
router.get('/consignees/search', searchConsignees);
router.put('/consignees/:id', updateConsignee);

module.exports = router;
