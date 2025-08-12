// Load environment variables from .env file (for sensitive configuration)
import 'dotenv/config';

// Import core dependencies
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import route files
import authRouter from './routes/Auth.js'; // New user authentication routes
import router from './routes/index.js'; // Core routes from template
// import waterRoutes from "./routes/waterRoutes.js";
// import plasticRoutes from "./routes/plasticRoutes.js";

// Initialize Express application
const app = express();
const port = process.env.PORT || 5000; // Use environment variable with fallback

/**
 * Database Connection Setup
 * Enhanced with modern options and error handling
 */
const mongoUri = process.env.MONGO_URI || 'mongodb://mongodb:27017/hydropal-db'; // Default MongoDB URI
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
  }
)
.then(() => {
  console.log('🚀 Successfully connected to MongoDB');
  console.log(`   Database: ${mongoose.connection.name}`);
  console.log(`   Host: ${mongoose.connection.host}`);
})
.catch(err => {
  console.error('❌ Database connection error:', err.message);
  process.exit(1); // Exit process on connection failure
});

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // CoreUI frontend
  optionsSuccessStatus: 200, // For legacy browser support because some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev')); // HTTP request logging
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Health Check Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ 
    title: 'HydroPal API',
    status: 'operational',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', router); // Core routes
app.use('/api/auth', authRouter); // Authentication routes
// app.use('/api/water', waterRoutes);
// app.use('/api/plastic', plasticRoutes);

// 404 Handler
app.use('/api', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// Start Server with enhanced error handling
const server = app.listen(port, () => {
  console.log(`\n🌍 Express server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🔌 API endpoints available at http://localhost:${port}/api`);
  console.log(`📊 Database status: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server and database connections closed');
      process.exit(0);
    });
  });
});
