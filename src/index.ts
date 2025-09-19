import { Router } from 'express';
import {userRoutes} from './modules/user/routes';
import {authRoutes} from './modules/auth/routes';
import {employeeRoutes} from './modules/employee/router';
import { productRoutes } from './modules/product/routes';
import { saleRoutes } from './modules/sale/routes';
import { authMiddleware } from './infrastructure/middlewares/authMiddleware';

const router = Router();

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/user',authMiddleware, userRoutes);
router.use('/sale', authMiddleware, saleRoutes );
router.use('/product', authMiddleware, productRoutes);
router.use('/employee', authMiddleware, employeeRoutes);

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('API de Joyería funcionando correctamente');
});

export default router;
