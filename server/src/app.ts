import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import doctorRoutes from './routes/doctorRoutes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Parse and normalize allowed origins for CORS
const rawAllowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
]
  .filter(Boolean)
  .flatMap((url) => (url ? url.split(',').map((u) => u.trim()) : []));

const allowedOriginsSet = new Set(rawAllowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Allow non-browser requests with no origin header (curl, mobile, server-to-server)
      if (!origin) return callback(null, true);

      // 2. Allow wildcard if specified in environment
      if (allowedOriginsSet.has('*')) return callback(null, true);

      // 3. Allow exact matches in configured origins
      if (allowedOriginsSet.has(origin)) return callback(null, true);

      // 4. Allow any local development origin
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }

      // 5. Allow Vercel preview and production deployments
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      callback(new Error(`CORS policy: Origin '${origin}' is not allowed by Access-Control-Allow-Origin.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless Database Connection Middleware:
// Ensures MongoDB Atlas connection is active before dispatching to controllers
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('[Database Middleware Error]:', error?.message || error);
    res.status(503).json({
      success: false,
      message: 'Database service is temporarily unavailable. Please verify database connectivity.',
      error: process.env.NODE_ENV === 'production' ? undefined : error?.message,
    });
  }
});

// Root informational routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    name: 'MediCore Healthcare API',
    version: '1.0.0',
    status: 'operational',
    healthCheck: '/api/health',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to MediCore Healthcare REST API',
    version: '1.0.0',
    healthCheck: '/api/health',
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      patients: '/api/patients',
      appointments: '/api/appointments',
      doctors: '/api/doctors',
    },
  });
});

// Health check endpoint (exposes no sensitive data or credentials)
app.get('/api/health', (req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    message: 'MediCore API is healthy and operational',
    database: isDbConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Primary API route mounts
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);

// 404 Not Found handler for undefined API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
