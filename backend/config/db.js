import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri || connUri.includes('cluster0.example.mongodb.net')) {
      console.warn('\n==================================================================');
      console.warn('WARNING: MongoDB Connection URI is still using the default placeholder.');
      console.warn('Please update MONGODB_URI in "backend/.env" to your actual MongoDB Atlas');
      console.warn('connection string. The server will attempt to connect but may fail.');
      console.warn('==================================================================\n');
    }

    const conn = await mongoose.connect(connUri || 'mongodb://127.0.0.1:27017/temu_clone');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Make sure your MongoDB server is running or the Atlas connection string is correct.');
    process.exit(1);
  }
};

export default connectDB;
