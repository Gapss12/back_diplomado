import type { Request, Response } from "express"
import { GetAllProductsUseCase } from "../../core/product/application/useCases/GetAllProductsUseCase"
import { GetProductByIdUseCase } from "../../core/product/application/useCases/GetProductByIdUseCase"
import { CreateProductUseCase } from "../../core/product/application/useCases/CreateProductUseCase"
import { UpdateProductUseCase } from "../../core/product/application/useCases/UpdateProductUseCase"
import { DeleteProductUseCase } from "../../core/product/application/useCases/DeleteProductUseCase"
import { ProductRepository } from "../../infrastructure/persistence/repositories/ProductRepository"

const productRepository = new ProductRepository()

export const productController = {
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const getAllProductsUseCase = new GetAllProductsUseCase(productRepository)
      const result = await getAllProductsUseCase.execute()

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const products = result.getValue()

      res.status(200).json({
        success: true,
        data: products.map((product) => ({
          id: product.id.toValue(),
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price.value,
        })),
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener productos",
        error: error,
      })
    }
  },

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const productId = parseInt(id, 10)

      if (isNaN(productId)) {
        res.status(400).json({
          success: false,
          message: "ID de producto inválido",
        })
        return
      }

      const getProductByIdUseCase = new GetProductByIdUseCase(productRepository)
      const result = await getProductByIdUseCase.execute(productId)

      if (result.isFailure) {
        res.status(404).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const product = result.getValue()

      res.status(200).json({
        success: true,
        data: {
          id: product.id.toValue(),
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price.value,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el producto",
        error: error,
      })
    }
  },

async createProduct(req: Request, res: Response): Promise<void> {
  try {
    console.log('=== CREATE PRODUCT DEBUG ===')
    console.log('req.body:', req.body)
    console.log('req.file:', req.file)
    console.log('name:', req.body.name)
    console.log('price:', req.body.price)
    console.log('name type:', typeof req.body.name)
    console.log('price type:', typeof req.body.price)
    
    const { name, price } = req.body
    
    // Validaciones básicas
    if (!name || !price) {
      console.log('Validation failed - missing name or price')
      res.status(400).json({
        success: false,
        message: "Nombre y precio son requeridos",
        debug: {
          name: name,
          price: price,
          nameExists: !!name,
          priceExists: !!price
        }
      })
      return
    }

    const createProductUseCase = new CreateProductUseCase(productRepository)
    const result = await createProductUseCase.execute({
      name,
      price: parseFloat(price),
      imageFile: req.file,
    })

    if (result.isFailure) {
      res.status(400).json({
        success: false,
        message: result.getError(),
      })
      return
    }

    const product = result.getValue()

    res.status(201).json({
      success: true,
      data: {
        id: product.id.toValue(),
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price.value,
      },
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      error: error,
    })
  }
},
// controller.ts - Método updateProduct corregido

async updateProduct(req: Request, res: Response): Promise<void> {
  try {
    // ✅ AGREGAR DEBUGGING COMO EN CREATE
    console.log('=== UPDATE PRODUCT DEBUG ===')
    console.log('req.params:', req.params)
    console.log('req.body:', req.body)
    console.log('req.file:', req.file)
    console.log('name:', req.body.name)
    console.log('price:', req.body.price)
    console.log('name type:', typeof req.body.name)
    console.log('price type:', typeof req.body.price)
    
    const { id } = req.params
    const { name, price } = req.body
    const productId = parseInt(id, 10)

    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "ID de producto inválido",
      })
      return
    }

    // Validaciones básicas
    if (!name || !price) {
      console.log('Validation failed - missing name or price')
      res.status(400).json({
        success: false,
        message: "Nombre y precio son requeridos",
        debug: {
          name: name,
          price: price,
          nameExists: !!name,
          priceExists: !!price,
          bodyKeys: Object.keys(req.body)
        }
      })
      return
    }

    // ✅ CAMBIAR ESTO: usar imageFile en lugar de imageUrl
    const updateProductUseCase = new UpdateProductUseCase(productRepository)
    const result = await updateProductUseCase.execute(productId, {
      name,
      price: parseFloat(price),
      imageFile: req.file,
    })

    if (result.isFailure) {
      res.status(400).json({
        success: false,
        message: result.getError(),
      })
      return
    }

    const product = result.getValue()

    res.status(200).json({
      success: true,
      data: {
        id: product.id.toValue(),
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price.value,
      },
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      error: error,
    })
  }
},

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const productId = parseInt(id, 10)

      if (isNaN(productId)) {
        res.status(400).json({
          success: false,
          message: "ID de producto inválido",
        })
        return
      }

      const deleteProductUseCase = new DeleteProductUseCase(productRepository)
      const result = await deleteProductUseCase.execute(productId)

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      res.status(200).json({
        success: true,
        data: {
          message: "Producto eliminado exitosamente",
          id: productId,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar el producto",
        error: error,
      })
    }
  },
}