import type { IProductRepository } from "../../domain/IProductRepository"
import { Result } from "@shared/domain/Result"
import { Product } from "../../domain/Product"
import { Price } from "../../domain/Price"
import path from "path"
import fs from "fs/promises"

interface UpdateProductRequest {
  name: string
  price: number
  imageFile?: Express.Multer.File
  imageUrl?: string
}

export class UpdateProductUseCase {
  private productRepository: IProductRepository
  private readonly uploadDir = "uploads"

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository
  }

  async execute(id: number, request: UpdateProductRequest): Promise<Result<Product>> {
    try {
      const { name, price: priceValue, imageFile, imageUrl } = request

      // Validaciones
      if (!id || id <= 0) {
        return Result.fail<Product>("ID de producto inválido")
      }

      if (!name || name.trim().length === 0) {
        return Result.fail<Product>("El nombre del producto es requerido")
      }

      if (!priceValue || priceValue <= 0) {
        return Result.fail<Product>("El precio debe ser mayor a 0")
      }

      // Verificar que el producto existe
      const existingProduct = await this.productRepository.findById(id)
      if (!existingProduct) {
        return Result.fail<Product>("Producto no encontrado")
      }

      // Crear el objeto Price
      const priceResult = Price.create(priceValue)
      if (priceResult.isFailure) {
        return Result.fail<Product>(priceResult.getError())
      }

      // Manejar la imagen (mantener la existente si no se proporciona una nueva)
      let finalImageUrl = imageUrl || existingProduct.imageUrl
      
      if (imageFile) {
        try {
          // Crear directorio si no existe
          await fs.mkdir(this.uploadDir, { recursive: true })
          
          // Generar nombre único para el archivo
          const fileExtension = path.extname(imageFile.originalname)
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`
          const filePath = path.join(this.uploadDir, fileName)
          
          // Mover el archivo desde la ubicación temporal
          await fs.copyFile(imageFile.path, filePath)
          
          // Eliminar archivo temporal
          await fs.unlink(imageFile.path).catch(() => {})
          
          // Eliminar imagen anterior si existe
          if (existingProduct.imageUrl && existingProduct.imageUrl.startsWith('/uploads/')) {
            const oldImagePath = path.join('.', existingProduct.imageUrl)
            await fs.unlink(oldImagePath).catch(() => {}) // Ignorar errores
          }
          
          finalImageUrl = `/uploads/${fileName}`
        } catch (fileError) {
          return Result.fail<Product>(`Error al procesar la imagen: ${fileError}`)
        }
      }

      // Crear producto actualizado
      const updatedProductResult = Product.create(
        name.trim(),
        finalImageUrl,
        priceResult.getValue(),
        existingProduct.id
      )

      if (updatedProductResult.isFailure) {
        return Result.fail<Product>(updatedProductResult.getError())
      }

      // Actualizar en el repositorio
      const updatedProduct = updatedProductResult.getValue()
      const savedProduct = await this.productRepository.update(id, updatedProduct)
      
      return Result.ok<Product>(savedProduct)
    } catch (error) {
      return Result.fail<Product>(`Error al actualizar el producto: ${error}`)
    }
  }
}