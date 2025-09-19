import type { IProductRepository } from "../../domain/IProductRepository"
import { Result } from "@shared/domain/Result"
import { Product } from "../../domain/Product"
import { Price } from "../../domain/Price"
import path from "path"
import fs from "fs/promises"

interface CreateProductRequest {
  name: string
  price: number
  imageFile?: Express.Multer.File // Archivo de imagen desde multer
  imageUrl?: string // URL de imagen alternativa
}

export class CreateProductUseCase {
  private productRepository: IProductRepository
  private readonly uploadDir = "uploads" // Directorio para guardar imágenes

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository
  }

  async execute(request: CreateProductRequest): Promise<Result<Product>> {
    try {
      const { name, price: priceValue, imageFile, imageUrl } = request

      // Validaciones
      if (!name || name.trim().length === 0) {
        return Result.fail<Product>("El nombre del producto es requerido")
      }

      if (!priceValue || priceValue <= 0) {
        return Result.fail<Product>("El precio debe ser mayor a 0")
      }

      // Crear el objeto Price
      const priceResult = Price.create(priceValue)
      if (priceResult.isFailure) {
        return Result.fail<Product>(priceResult.getError())
      }

      // Manejar la imagen
      let finalImageUrl = imageUrl || ""
      
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
          await fs.unlink(imageFile.path).catch(() => {}) // Ignorar errores al eliminar temp
          
          finalImageUrl = `/uploads/${fileName}`
        } catch (fileError) {
          return Result.fail<Product>(`Error al procesar la imagen: ${fileError}`)
        }
      }

      // Crear el producto
      const productResult = Product.create(
        name.trim(),
        finalImageUrl,
        priceResult.getValue()
      )

      if (productResult.isFailure) {
        return Result.fail<Product>(productResult.getError())
      }

      // Guardar en el repositorio
      const product = productResult.getValue()
      const savedProduct = await this.productRepository.save(product)
      
      return Result.ok<Product>(savedProduct)
    } catch (error) {
      return Result.fail<Product>(`Error al crear el producto: ${error}`)
    }
  }
}