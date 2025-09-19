import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public getAllProducts = async (_req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Error retrieving products'
      });
    }
  };

  public getProductById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(parseInt(req.params.id));
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Error retrieving product'
      });
    }
  };
}