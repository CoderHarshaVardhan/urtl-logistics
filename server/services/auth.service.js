const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');

const registerUser = async (userData) => {
  const { name } = userData;
  const userExists = await User.findOne({ name });

  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create(userData);
  return user;
};

const loginUser = async (name, password) => {
  const user = await User.findOne({ name }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid name or password');
  }

  return user;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
