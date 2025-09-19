
import { Router } from 'express';
import  userRoutes  from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middleware/auth.middleware';
import productRoutes from './routes/product.routes';
import employeeRoutes from './routes/employe.routes';
import saleRoutes from './routes/sale.routes';


const router = Router();


router.use('/user',authMiddleware, userRoutes);
router.use('/product',authMiddleware, productRoutes);
router.use('/employee',authMiddleware, employeeRoutes);
router.use('/sale',authMiddleware, saleRoutes);
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
  res.send('Hello World');
});

export default router;