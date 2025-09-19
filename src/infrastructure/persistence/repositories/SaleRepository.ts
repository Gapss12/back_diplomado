import type { ISaleRepository } from "../../../core/sale/domain/ISaleRepository"
import { Sale } from "../../../core/sale/domain/Sale"
import { CustomerName } from "../../../core/sale/domain/CustomerName"
import { SaleModel } from "../models/SaleModel"
import { UniqueEntityID } from "@shared/domain/UniqueEntityID"

export class SaleRepository implements ISaleRepository {
  async findById(id: number | string): Promise<Sale | null> {
    const saleRecord = await SaleModel.findByPk(id)
    if (!saleRecord) return null

    return this.toDomain(saleRecord)
  }

  async save(sale: Sale): Promise<void> {
    const saleData = {
      employeeId: sale.employeeId.toValue(),
      productId: sale.productId.toValue(),
      customerName: sale.customerName.value,
      saleDate: sale.saleDate,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    }

    await SaleModel.create(saleData as any)
  }

  async findAll(): Promise<Sale[]> {
    const saleRecords = await SaleModel.findAll()
    return Promise.all(saleRecords.map((record) => this.toDomain(record)))
  }

  private async toDomain(saleRecord: SaleModel): Promise<Sale> {
    const customerNameOrError = CustomerName.create(saleRecord.customerName)

    if (customerNameOrError.isFailure) {
      throw new Error("Error al mapear venta desde la base de datos")
    }

    const saleOrError = Sale.create(
      new UniqueEntityID(saleRecord.employeeId),
      new UniqueEntityID(saleRecord.productId),
      customerNameOrError.getValue(),
      new UniqueEntityID(saleRecord.id),
    )

    if (saleOrError.isFailure) {
      throw new Error("Error al crear entidad de venta")
    }

    return saleOrError.getValue()
  }
}
