import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const isVercel = process.env.VERCEL === '1';
app.use('/uploads', express.static(isVercel ? '/tmp/uploads' : 'uploads'));

// Routes
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Temu Clone API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Only listen on PORT if not running as a serverless function on Vercel
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
