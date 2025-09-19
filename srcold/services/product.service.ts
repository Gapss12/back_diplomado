import { Product } from '../models/product.model';

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return await Product.findAll();
  }

  async getProductById(id: number): Promise<Product | null> {
    return await Product.findByPk(id);
  }
}