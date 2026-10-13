import { Router } from 'express';
import {
  getStats,
  getTodayAppointments,
  getAppointmentStatistics,
} from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);
router.get('/today-appointments', getTodayAppointments);
router.get('/appointment-statistics', getAppointmentStatistics);

export default router;
