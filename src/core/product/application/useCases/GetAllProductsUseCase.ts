import type { IProductRepository } from "../../domain/IProductRepository"
import { Result } from "@shared/domain/Result"
import type { Product } from "../../domain/Product"

export class GetAllProductsUseCase {
  private productRepository: IProductRepository

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository
  }

  async execute(): Promise<Result<Product[]>> {
    try {
      const products = await this.productRepository.findAll()
      return Result.ok<Product[]>(products)
    } catch (error) {
      return Result.fail<Product[]>(`Error al obtener productos: ${error}`)
    }
  }
}
