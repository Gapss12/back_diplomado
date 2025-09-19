import { Sale } from "../../domain/Sale"
import { CustomerName } from "../../domain/CustomerName"
import type { ISaleRepository } from "../../domain/ISaleRepository"
import { Result } from "@shared/domain/Result"
import { UniqueEntityID } from "@shared/domain/UniqueEntityID"
import type { IEmployeeRepository } from "../../../employee/domain/IEmployeeRepository"
import type { IProductRepository } from "../../../product/domain/IProductRepository"
import { CreateSaleDTO } from "../dtos/CreateSaleDto"

export class CreateSaleUseCase {
  private saleRepository: ISaleRepository
  private employeeRepository: IEmployeeRepository
  private productRepository: IProductRepository

  constructor(
    saleRepository: ISaleRepository,
    employeeRepository: IEmployeeRepository,
    productRepository: IProductRepository,
  ) {
    this.saleRepository = saleRepository
    this.employeeRepository = employeeRepository
    this.productRepository = productRepository
  }

  async execute(request: CreateSaleDTO): Promise<Result<void>> {
    // Validar nombre del cliente
    const customerNameOrError = CustomerName.create(request.customerName)
    if (customerNameOrError.isFailure) {
      return Result.fail<void>(customerNameOrError.getError())
    }
    const customerName = customerNameOrError.getValue()

    // Verificar si el empleado existe
    const employeeExists = await this.employeeRepository.exists(request.employeeId)
    if (!employeeExists) {
      return Result.fail<void>("El empleado no existe")
    }

    // Verificar si el producto existe
    const productExists = await this.productRepository.exists(request.productId)
    if (!productExists) {
      return Result.fail<void>("El producto no existe")
    }

    // Crear la venta
    const employeeId = new UniqueEntityID(request.employeeId)
    const productId = new UniqueEntityID(request.productId)

    const saleOrError = Sale.create(employeeId, productId, customerName)

    if (saleOrError.isFailure) {
      return Result.fail<void>(saleOrError.getError())
    }

    const sale = saleOrError.getValue()

    // Guardar la venta
    await this.saleRepository.save(sale)

    return Result.ok<void>()
  }
}
