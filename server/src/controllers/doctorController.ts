import { Request, Response, NextFunction } from 'express';
import { Doctor } from '../models/Doctor';

export const getDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};
