import { NextFunction, Request, Response } from 'express'
import productService from '~/services/product.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ProductIdReqQuery, UpdateProductReqBody } from '~/models/requests/Product.requests'
import { PRODUCT_MESSAGES } from '~/constants/messages'

export const addProductController = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body
  const result = await productService.addProduct(body)
  return res.json({
    message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    result
  })
}

export const getProductsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await productService.getProducts()
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCTS_SUCCESS,
    result
  })
}

export const getProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const result = await productService.getProduct(product_id)
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCT_SUCCESS,
    result
  })
}

export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductReqBody, ProductIdReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const { product_id } = req.params
  const payload = req.body
  const result = await productService.updateProduct(product_id, payload)
  return res.json({
    message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    result
  })
}
