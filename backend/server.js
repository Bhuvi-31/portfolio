const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/db');
const logger = require('./utils/logger');

// Import Middleware
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import Route Handlers
const contactRoutes = require('./routes/contact');
const projectsRoutes = require('./routes/projects');
const certificatesRoutes = require('./routes/certificates');
const profileRoutes = require('./routes/profile');
const newsletterRoutes = require('./routes/newsletter');

const app = express();

// Trust reverse proxy for rate limiting (Render, Netlify, Nginx)
app.set('trust proxy', 1);

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000',
  'https://bhuvaneshwari2006.netlify.app',
  config.frontendUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps) or allowed origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.netlify.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS restriction: Origin ${origin} not allowed.`));
    },
    credentials: true,
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global Rate Limiter
app.use('/api', apiLimiter);

// Requirement 7: Health Check Endpoint returning { status: "OK" }
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
  });
});

// API Routes Registration
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Portfolio API Server is running cleanly.');
});

// 404 & Global Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Express Server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
});

module.exports = app;
