import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';

const router = Router();
const saleController = new SaleController();

router.post('/', saleController.createSale);
router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSaleById);

export default router;