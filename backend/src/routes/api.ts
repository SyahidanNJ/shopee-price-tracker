import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { authRoutes } from './auth';
import { productRoutes } from './product';
import { telegramRoutes } from './telegram';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/telegram', telegramRoutes);
router.get('/health', healthController);

export const apiRoutes = router;
