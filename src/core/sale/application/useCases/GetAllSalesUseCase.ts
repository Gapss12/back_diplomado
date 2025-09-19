import type { ISaleRepository } from "../../domain/ISaleRepository"
import { Result } from "@shared/domain/Result"
import type { Sale } from "../../domain/Sale"

export class GetAllSalesUseCase {
  private saleRepository: ISaleRepository

  constructor(saleRepository: ISaleRepository) {
    this.saleRepository = saleRepository
  }

  async execute(): Promise<Result<Sale[]>> {
    try {
      const sales = await this.saleRepository.findAll()
      return Result.ok<Sale[]>(sales)
    } catch (error) {
      return Result.fail<Sale[]>(`Error al obtener ventas: ${error}`)
    }
  }
}
