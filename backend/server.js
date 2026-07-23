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
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5500',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS Policy restriction: Origin not allowed.'));
    },
    credentials: true,
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global Rate Limiter
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: config.env,
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
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
});

module.exports = app;
