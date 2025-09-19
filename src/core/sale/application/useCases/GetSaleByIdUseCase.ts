import type { ISaleRepository } from "../../domain/ISaleRepository"
import { Result } from "@shared/domain/Result"
import type { Sale } from "../../domain/Sale"

export class GetSaleByIdUseCase {
  private saleRepository: ISaleRepository

  constructor(saleRepository: ISaleRepository) {
    this.saleRepository = saleRepository
  }

  async execute(id: string | number): Promise<Result<Sale>> {
    try {
      const sale = await this.saleRepository.findById(id)
      if (!sale) {
        return Result.fail<Sale>("Venta no encontrada")
      }
      return Result.ok<Sale>(sale)
    } catch (error) {
      return Result.fail<Sale>(`Error al buscar venta: ${error}`)
    }
  }
}
