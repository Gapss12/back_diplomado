import { Sale, SaleAttributes } from '../models/sale.model';
import { Employee } from '../models/employe.model';
import { Product } from '../models/product.model';
import { Op } from 'sequelize';

interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  productId?: number;
}

export class SaleService {
  async createSale(data: SaleAttributes): Promise<Sale> {
    return await Sale.create(data);
  }

  async getAllSales(filters?: FilterOptions): Promise<Sale[]> {
    const whereClause: any = {};
    
    if (filters?.startDate && filters?.endDate) {
      whereClause.createdAt = {
        [Op.between]: [filters.startDate, filters.endDate]
      };
    }
    
    if (filters?.productId) {
      whereClause.productId = filters.productId;
    }

    return await Sale.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Product,
          attributes: ['id', 'name', 'price']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async getSaleById(id: number): Promise<Sale | null> {
    return await Sale.findByPk(id, {
      include: [
        {
          model: Employee,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Product,
          attributes: ['id', 'name', 'price']
        }
      ]
    });
  }
}