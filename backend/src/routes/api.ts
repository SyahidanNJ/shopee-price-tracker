import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { authRoutes } from './auth';
import { productRoutes } from './product';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.get('/health', healthController);

export const apiRoutes = router;
