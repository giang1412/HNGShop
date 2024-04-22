import { NextFunction, Request, Response } from 'express'
import { ProductReqBody } from '~/models/requests/Product.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import productService from '~/services/product.services'

export const addProductController = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body
  const result = await productService.addProduct(body)
  return res.json({
    message: 'Create product success',
    result
  })
}
