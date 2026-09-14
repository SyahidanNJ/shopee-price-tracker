import { Router } from 'express';
import { alertController } from '../controllers/alert.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/:id/alert', alertController.get);
router.put('/:id/alert', alertController.update);

export const alertRoutes = router;
