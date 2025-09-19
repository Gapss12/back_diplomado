import { Request, Response } from 'express';
import { SaleService } from '../services/sale.service';

export class SaleController {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  public createSale = async (req: Request, res: Response)=> {
    try {
      const sale = await this.saleService.createSale(req.body);
       res.status(201).json({
        message: 'Sale created successfully',
        sale
      });
    } catch (error) {
       res.status(400).json({
        message: error instanceof Error ? error.message : 'Error creating sale'
      });
    }
  };

  public getAllSales = async (req: Request, res: Response)=> {
    try {
      const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        productId: req.query.productId ? parseInt(req.query.productId as string) : undefined
      };

      const sales = await this.saleService.getAllSales(filters);
       res.status(200).json(sales);
    } catch (error) {
       res.status(500).json({
        message: error instanceof Error ? error.message : 'Error retrieving sales'
      });
    }
  };

  public getSaleById = async (req: Request, res: Response)=> {
    try {
      const sale = await this.saleService.getSaleById(parseInt(req.params.id));
      if (!sale) {
         res.status(404).json({ message: 'Sale not found' });
      }
       res.status(200).json(sale);
    } catch (error) {
       res.status(500).json({
        message: error instanceof Error ? error.message : 'Error retrieving sale'
      });
    }
  };
}