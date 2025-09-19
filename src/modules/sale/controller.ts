import type { Request, Response } from "express"
import { CreateSaleUseCase } from "../../core/sale/application/useCases/CreateSaleUseCase"
import { GetSaleByIdUseCase } from "../../core/sale/application/useCases/GetSaleByIdUseCase"
import { GetAllSalesUseCase } from "../../core/sale/application/useCases/GetAllSalesUseCase"
import { SaleRepository } from "../../infrastructure/persistence/repositories/SaleRepository"
import { EmployeeRepository } from "../../infrastructure/persistence/repositories/EmployeeRepository"
import { ProductRepository } from "../../infrastructure/persistence/repositories/ProductRepository"

const saleRepository = new SaleRepository()
const employeeRepository = new EmployeeRepository()
const productRepository = new ProductRepository()

export const saleController = {
async createSale(req: Request, res: Response): Promise<void> {
  try {

    const { employeeId, productId, customerName } = req.body

    if (!employeeId || !productId || !customerName) {
      res.status(400).json({
        success: false,
        message: "employeeId, productId y customerName son requeridos",
      })
      return
    }


    const createSaleUseCase = new CreateSaleUseCase(saleRepository, employeeRepository, productRepository)

    const result = await createSaleUseCase.execute({
      employeeId,
      productId,
      customerName,
    })


    if (result.isFailure) {
      res.status(400).json({
        success: false,
        message: result.getError(),
      })
      return
    }

    res.status(201).json({
      success: true,
      message: "Venta registrada exitosamente",
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('💥 Stack trace:', error.stack)
    }
    res.status(500).json({
      success: false,
      message: "Error al registrar venta",
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
    })
  }
},

  async getSaleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const getSaleByIdUseCase = new GetSaleByIdUseCase(saleRepository)
      const result = await getSaleByIdUseCase.execute(id)

      if (result.isFailure) {
        res.status(404).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const sale = result.getValue()

      res.status(200).json({
        success: true,
        data: {
          id: sale.id.toValue(),
          employeeId: sale.employeeId.toValue(),
          productId: sale.productId.toValue(),
          customerName: sale.customerName.value,
          saleDate: sale.saleDate,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener venta",
        error: error,
      })
    }
  },

  async getAllSales(req: Request, res: Response): Promise<void> {
    try {
      const getAllSalesUseCase = new GetAllSalesUseCase(saleRepository)
      const result = await getAllSalesUseCase.execute()

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const sales = result.getValue()

      res.status(200).json({
        success: true,
        data: sales.map((sale) => ({
          id: sale.id.toValue(),
          employeeId: sale.employeeId.toValue(),
          productId: sale.productId.toValue(),
          customerName: sale.customerName.value,
          saleDate: sale.saleDate,
        })),
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener ventas",
        error: error,
      })
    }
  },
}
