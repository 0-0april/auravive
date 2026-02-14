import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/carts.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: 'Database connected successfully' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Ensure required tables exist and run migrations
(async () => {
  try {
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('users', 'products', 'orders', 'carts')
    `, [process.env.DB_NAME || 'auravivedb']);

    if (tables.length >= 3) {
      console.log('✅ All required tables exist');
    } else {
      console.warn('⚠️  Some tables may be missing. Please check your database schema.');
    }

    // Migration: add quantity column to carts if it doesn't exist
    try {
      const [columns] = await pool.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'carts' AND COLUMN_NAME = 'quantity'
      `, [process.env.DB_NAME || 'auravivedb']);

      if (columns.length === 0) {
        await pool.query('ALTER TABLE carts ADD COLUMN quantity INT DEFAULT 1');
        console.log('✅ Added quantity column to carts table');
      }
    } catch (migrationErr) {
      console.warn('⚠️  Cart migration note:', migrationErr.message);
    }
  } catch (err) {
    console.error('❌ Database table check failed:', err.message);
  }
})();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/users/login',
      'POST /api/users/register',
      'GET /api/products',
      'GET /api/products/categories',
      'GET /api/orders',
      'GET /api/orders/user/:userID',
      'POST /api/orders',
      'GET /api/carts/:userID',
      'POST /api/carts',
      'PUT /api/carts/:cartID',
      'DELETE /api/carts/item/:cartID',
      'DELETE /api/carts/user/:userID',
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 AuraVive Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'auravivedb'} at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API docs: http://localhost:${PORT}/\n`);
});