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
  'http://127.0.0.1:3000',
]
  .filter(Boolean)
  .flatMap((url) => (url ? url.split(',').map((u) => u.trim().replace(/\/+$/, '')) : []));

const allowedOriginsSet = new Set(rawAllowedOrigins);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 1. Allow non-browser requests with no origin header (curl, mobile, server-to-server)
    if (!origin) return callback(null, true);

    // 2. Allow wildcard if specified in environment
    if (allowedOriginsSet.has('*')) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');

    // 3. Allow exact matches in configured origins
    if (allowedOriginsSet.has(normalizedOrigin)) return callback(null, true);

    // 4. Allow local development origins
    if (
      normalizedOrigin.startsWith('http://localhost:') ||
      normalizedOrigin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }

    callback(new Error(`CORS policy: Origin '${origin}' is not allowed by Access-Control-Allow-Origin.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection Middleware:
// Ensures MongoDB connection is active before dispatching to controllers
app.use(async (req: Request, res: Response, next: NextFunction) => {
  // Allow health and root diagnostic checks to proceed without blocking
  const publicStatusPaths = ['/', '/api', '/api/health', '/health'];
  if (publicStatusPaths.includes(req.path)) {
    return next();
  }

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

// Diagnostic & Information Handler
const sendApiInfo = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
  } catch (err: any) {
    console.error('[sendApiInfo DB Error]:', err?.message || err);
  }

  res.status(200).json({
    success: true,
    name: 'MediCore Healthcare API',
    version: '1.0.0',
    status: 'operational',
    healthCheck: '/api/health',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      patients: '/api/patients',
      appointments: '/api/appointments',
      doctors: '/api/doctors',
    },
    timestamp: new Date().toISOString(),
  });
};

// Health Check Handler (Safe, non-leaking status check)
const sendHealthStatus = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
  } catch (err: any) {
    console.error('[Health Check DB Error]:', err?.message || err);
  }

  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    message: 'MediCore API is healthy and operational',
    database: isDbConnected ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
};

app.get(['/', '/api'], sendApiInfo);
app.get(['/api/health', '/health'], sendHealthStatus);

// Mount primary API routes with and without /api prefix for complete client/Vercel compatibility
const mountRoutes = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/dashboard`, dashboardRoutes);
  app.use(`${prefix}/patients`, patientRoutes);
  app.use(`${prefix}/appointments`, appointmentRoutes);
  app.use(`${prefix}/doctors`, doctorRoutes);
};

mountRoutes('/api');
mountRoutes('');

// 404 Not Found handler for undefined routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
