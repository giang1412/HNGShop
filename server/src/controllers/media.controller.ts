import { NextFunction, Request, Response } from 'express'
import mediaService from '~/services/media.services'
import productService from '~/services/product.services'

export const adminProductImageController = async (req: Request, res: Response, next: NextFunction) => {
  const maxFile = 4
  const { product_id } = req.params
  const imageUrls = await mediaService.uploadImage(req, maxFile)
  const imageUrl = Array.isArray(imageUrls) ? imageUrls : [imageUrls]
  const result = await productService.updateProductImage(product_id, imageUrl)
  return res.json({
    message: 'Them anh thanh cong',
    result
  })
}
