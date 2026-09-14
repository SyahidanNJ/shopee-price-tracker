import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { alertController } from '../controllers/alert.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', productController.findAll);
router.post('/', productController.create);
router.get('/:id', productController.findById);
router.get('/:id/alert', alertController.get);
router.put('/:id/alert', alertController.update);
router.patch('/:id', productController.update);
router.delete('/:id', productController.delete);

export const productRoutes = router;
