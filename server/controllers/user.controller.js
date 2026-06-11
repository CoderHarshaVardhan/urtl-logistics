const User = require('../models/User.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const authService = require('../services/auth.service');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, branch, password, role } = req.body;

    const userExists = await User.findOne({ name });
    if (userExists) {
      throw new ApiError(400, 'User already exists');
    }

    const user = await User.create({
      name,
      branch,
      password,
      role: role || 'user',
    });

    res.status(201).json(new ApiResponse(201, {
      _id: user._id,
      name: user.name,
      branch: user.branch,
      role: user.role,
    }, 'User created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.name = req.body.name || user.name;
    user.branch = req.body.branch || user.branch;
    user.role = req.body.role || user.role;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json(new ApiResponse(200, {
      _id: updatedUser._id,
      name: updatedUser.name,
      branch: updatedUser.branch,
      role: updatedUser.role,
    }, 'User updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
