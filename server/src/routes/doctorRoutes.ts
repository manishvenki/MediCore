import { Router } from 'express';
import { getDoctors } from '../controllers/doctorController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getDoctors);

export default router;
