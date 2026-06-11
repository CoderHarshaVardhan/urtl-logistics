const express = require('express');
const authController = require('../../controllers/auth.controller');
const validate = require('../../middleware/validate.middleware');
const authValidation = require('../../validations/auth.validation');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/profile', protect, authController.getProfile);

module.exports = router;
