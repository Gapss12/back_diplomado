import type { Product } from "./Product"

export interface IProductRepository {
  findById(id: number | string): Promise<Product | null>
  findAll(): Promise<Product[]>
  exists(id: number | string): Promise<boolean>
  save(product: Product): Promise<Product>
  update(id: number | string, product: Product): Promise<Product>
  delete(id: number | string): Promise<void>
}