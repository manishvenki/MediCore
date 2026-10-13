import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import { seedDatabase } from './services/seed';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed to ensure immediate seamless demo experience
    try {
      await seedDatabase();
    } catch (seedErr) {
      console.warn('Seeding note:', seedErr);
    }

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` MediCore Healthcare Server Running `);
      console.log(` Port: ${PORT}`);
      console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Fatal: Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
