import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import doctorRoutes from './routes/doctorRoutes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Allowed origins
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching clientUrl
      if (!origin || origin === clientUrl || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Not allowed by origin'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'MediCore API is healthy and operational',
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
