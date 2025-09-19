import type { IProductRepository } from "../../domain/IProductRepository"
import { Result } from "@shared/domain/Result"
import path from "path"
import fs from "fs/promises"

export class DeleteProductUseCase {
  private productRepository: IProductRepository

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository
  }

  async execute(id: number): Promise<Result<void>> {
    try {
      if (!id || id <= 0) {
        return Result.fail<void>("ID de producto inválido")
      }

      // Verificar que el producto existe
      const existingProduct = await this.productRepository.findById(id)
      if (!existingProduct) {
        return Result.fail<void>("Producto no encontrado")
      }

      // Eliminar archivo de imagen si existe
      if (existingProduct.imageUrl && existingProduct.imageUrl.startsWith('/uploads/')) {
        const imagePath = path.join('.', existingProduct.imageUrl)
        await fs.unlink(imagePath).catch(() => {}) // Ignorar errores al eliminar imagen
      }

      // Eliminar del repositorio
      await this.productRepository.delete(id)
      
      return Result.ok<void>(undefined)
    } catch (error) {
      return Result.fail<void>(`Error al eliminar el producto: ${error}`)
    }
  }
}