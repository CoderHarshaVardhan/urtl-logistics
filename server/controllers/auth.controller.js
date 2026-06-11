const authService = require('../services/auth.service');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const setTokens = (res, user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set refresh token in HTTP-Only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
};

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    const accessToken = setTokens(res, user);
    
    res.status(201).json(new ApiResponse(201, {
      _id: user._id,
      name: user.name,
      branch: user.branch,
      role: user.role,
      accessToken
    }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await authService.loginUser(name, password);
    const accessToken = setTokens(res, user);

    res.status(200).json(new ApiResponse(200, {
      _id: user._id,
      name: user.name,
      branch: user.branch,
      role: user.role,
      accessToken
    }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, 'No refresh token provided');
    }

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await authService.getUserById(decoded.id);
    const accessToken = setTokens(res, user);

    res.status(200).json(new ApiResponse(200, { accessToken }, 'Token refreshed successfully'));
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, {
      _id: req.user._id,
      name: req.user.name,
      branch: req.user.branch,
      role: req.user.role
    }, 'Profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  getProfile,
};
