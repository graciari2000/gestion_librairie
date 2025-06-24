import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import borrowingRoutes from './routes/borrowings.js';
import userRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Changed from 5003 to 5000

// MongoDB connection string - using environment variable
const MONGODB_URI = process.env.MONGODB_URI;

console.log('Starting server...');

// Middleware
app.use(cors());
app.use(express.json());

// Database connection status
let isDBConnected = false;

// Middleware to check database connection
const checkDBConnection = (req, res, next) => {
  if (!isDBConnected) {
    return res.status(503).json({ 
      message: 'Database connection unavailable. Please check your MongoDB configuration.',
      error: 'DATABASE_DISCONNECTED'
    });
  }
  next();
};

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not found in environment variables');
      console.log('📝 Please create a .env file with your MongoDB connection string');
      console.log('   Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library');
    }
    
    // Disable buffering to prevent timeout errors
    mongoose.set('bufferCommands', false);
    
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Reduced timeout for faster feedback
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    
    isDBConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📚 Database: ${conn.connection.name}`);
    
  } catch (error) {
    isDBConnected = false;
    console.error('❌ MongoDB connection error:', error.message);
    console.log('');
    console.log('🔧 To fix this issue:');
    console.log('1. Make sure your .env file exists in the root directory');
    console.log('2. Check that MONGODB_URI is set correctly in your .env file');
    console.log('3. Verify your MongoDB Atlas connection string is valid');
    console.log('4. Ensure your IP address is whitelisted in MongoDB Atlas');
    console.log('5. Check that your MongoDB Atlas credentials are correct');
    console.log('');
    console.log('⚠️  Server will continue running but database features will be unavailable');
    
    // Retry connection after 30 seconds
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 30000);
  }
};

// Health check endpoint (always available)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    mongodb: isDBConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes with database connection check
app.use('/api/auth', checkDBConnection, authRoutes);
app.use('/api/books', checkDBConnection, bookRoutes);
app.use('/api/borrowings', checkDBConnection, borrowingRoutes);
app.use('/api/users', checkDBConnection, userRoutes);

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  isDBConnected = true;
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  isDBConnected = false;
  console.log('📡 MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  isDBConnected = true;
  console.log('🔄 MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  isDBConnected = false;
  console.error('❌ MongoDB error:', err.message);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle MongoDB connection errors specifically
  if (err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({ 
      message: 'Database connection failed. Please check your MongoDB configuration.',
      error: 'DATABASE_CONNECTION_FAILED'
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: 'INTERNAL_SERVER_ERROR'
  });
});

// Start server immediately (don't wait for database)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
  
  // Start database connection attempt
  connectDB();
});