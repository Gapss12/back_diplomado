import type { IProductRepository } from "../../domain/IProductRepository"
import { Result } from "@shared/domain/Result"
import type { Product } from "../../domain/Product"

export class GetProductByIdUseCase {
  private productRepository: IProductRepository

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository
  }

  async execute(id: number): Promise<Result<Product>> {
    try {
      if (!id || id <= 0) {
        return Result.fail<Product>("ID de producto inválido")
      }

      const product = await this.productRepository.findById(id)
      
      if (!product) {
        return Result.fail<Product>("Producto no encontrado")
      }

      return Result.ok<Product>(product)
    } catch (error) {
      return Result.fail<Product>(`Error al obtener el producto: ${error}`)
    }
  }
}