const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

router.route('/')
  .get(protect, isAdmin, userController.getUsers)
  .post(protect, isAdmin, userController.createUser);

router.route('/:id')
  .put(protect, isAdmin, userController.updateUser)
  .delete(protect, isAdmin, userController.deleteUser);

module.exports = router;
