const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

const v1Routes = require('./routes/v1');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// 1. GLOBAL MIDDLEWARES

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
  })
);

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// Disabled: express-mongo-sanitize is incompatible with Express 5 (req.query is a getter)

// Data sanitization against XSS
// Disabled: xss-clean is incompatible with Express 5 (req.query is a getter)

// 2. ROUTES
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running successfully' });
});

app.use('/api/v1', v1Routes);

// 3. ERROR HANDLING
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
