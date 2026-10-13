import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
  code?: number;
  keyValue?: Record<string, any>;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: any[] = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values((err as any).errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000 && err.keyValue) {
    statusCode = 409;
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];
    message = `Duplicate field value entered: ${key} '${value}' already exists.`;
    errors = [{ field: key, message }];
  }

  // Mongoose CastError (invalid ObjectId or format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource identifier: ${(err as any).value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  console.error(`[Error] [${req.method} ${req.url}] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
