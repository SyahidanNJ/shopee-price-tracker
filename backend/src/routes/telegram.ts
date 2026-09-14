import { Router } from 'express';
import { telegramController } from '../controllers/telegram.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/status', telegramController.getStatus);
router.post('/bind', telegramController.bind);
router.post('/unbind', telegramController.unbind);
router.post('/test', telegramController.test);

export const telegramRoutes = router;
