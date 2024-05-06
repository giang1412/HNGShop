import { NextFunction, Request, Response } from 'express'
import productService from '~/services/product.services'

export const addProductController = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body
  const result = await productService.addProduct(body)
  return res.json({
    message: 'Create product success',
    result
  })
}

export const getProductsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await productService.getProducts()
  return res.json({
    message: 'Get products success',
    result
  })
}

export const getProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const result = await productService.getProduct(product_id)
  return res.json({
    message: 'Get products success',
    result
  })
}
