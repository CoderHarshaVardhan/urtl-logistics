const express = require('express');
const router = express.Router();
const loadingController = require('../controllers/loading.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', loadingController.getAllLoadings);
router.get('/next-number', loadingController.getNextLoadingNumber);
router.get('/:id', loadingController.getLoadingById);
router.post('/', loadingController.createLoading);
router.put('/:id', loadingController.updateLoading);

module.exports = router;
