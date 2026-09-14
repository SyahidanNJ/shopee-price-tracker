import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { authRoutes } from './auth';

const router = Router();

router.use('/auth', authRoutes);
router.get('/health', healthController);

export const apiRoutes = router;
