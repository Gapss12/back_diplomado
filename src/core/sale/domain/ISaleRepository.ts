import type { Sale } from "./Sale"

export interface ISaleRepository {
  findById(id: number | string): Promise<Sale | null >
  save(sale: Sale): Promise<void> 
  findAll(): Promise<Sale[]>
}
