import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', productController.findAll);
router.post('/', productController.create);
router.get('/:id', productController.findById);
router.patch('/:id', productController.update);
router.delete('/:id', productController.delete);

export const productRoutes = router;
