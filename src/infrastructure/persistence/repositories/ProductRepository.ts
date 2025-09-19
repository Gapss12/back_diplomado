import type { IProductRepository } from "@product/domain/IProductRepository"
import { Product } from "@product/domain/Product"
import { Price } from "@product/domain/Price"
import { ProductModel } from "../models/ProductModel"
import { UniqueEntityID } from "@shared/domain/UniqueEntityID"

export class ProductRepository implements IProductRepository {
  async findById(id: number | string): Promise<Product | null> {
    const productRecord = await ProductModel.findByPk(id)
    if (!productRecord) return null

    return this.toDomain(productRecord)
  }

  async findAll(): Promise<Product[]> {
    const productRecords = await ProductModel.findAll()
    return Promise.all(productRecords.map((record) => this.toDomain(record)))
  }

  async exists(id: number | string): Promise<boolean> {
    const count = await ProductModel.count({
      where: { id },
    })
    return count > 0
  }

  async save(product: Product): Promise<Product> {
    try {
      // Crear nuevo registro en la base de datos
      const productRecord = await ProductModel.create({
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price.value,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })

      // Convertir el registro guardado de vuelta a dominio
      return this.toDomain(productRecord)
    } catch (error) {
      throw new Error(`Error al guardar el producto: ${error}`)
    }
  }

  async update(id: number | string, product: Product): Promise<Product> {
    try {
      // Verificar que el producto existe
      const existingRecord = await ProductModel.findByPk(id)
      if (!existingRecord) {
        throw new Error("Producto no encontrado")
      }

      // Actualizar el registro
      await existingRecord.update({
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price.value,
        updatedAt: new Date(), // Actualizar fecha de modificación
      })

      // Recargar el registro actualizado
      await existingRecord.reload()

      // Convertir el registro actualizado de vuelta a dominio
      return this.toDomain(existingRecord)
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error}`)
    }
  }

  async delete(id: number | string): Promise<void> {
    try {
      // Verificar que el producto existe
      const existingRecord = await ProductModel.findByPk(id)
      if (!existingRecord) {
        throw new Error("Producto no encontrado")
      }

      // Eliminar el registro
      await existingRecord.destroy()
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error}`)
    }
  }

  private async toDomain(productRecord: ProductModel): Promise<Product> {
    const priceOrError = Price.create(productRecord.price)

    if (priceOrError.isFailure) {
      throw new Error(`Error al mapear precio desde la base de datos: ${priceOrError.getError()}`)
    }

    const productOrError = Product.create(
      productRecord.name,
      productRecord.imageUrl,
      priceOrError.getValue(),
      new UniqueEntityID(productRecord.id),
    )

    if (productOrError.isFailure) {
      throw new Error(`Error al crear entidad de producto: ${productOrError.getError()}`)
    }

    return productOrError.getValue()
  }

  // Método auxiliar para convertir de dominio a datos persistibles
  private toDataModel(product: Product): {
    name: string
    imageUrl: string
    price: number
    createdAt: Date
    updatedAt: Date
  } {
    return {
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price.value,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}