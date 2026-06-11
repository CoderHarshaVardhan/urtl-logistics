const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!err.isOperational) {
    statusCode = err.statusCode || 500;
    
    if (err.code === 11000) {
      statusCode = 400;
      const field = Object.keys(err.keyValue)[0];
      message = `An account with that ${field} already exists.`;
    } else if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map(el => el.message).join('. ');
    } else {
      message = err.message || 'Internal Server Error';
    }
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode || 500).json(response);
};

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
