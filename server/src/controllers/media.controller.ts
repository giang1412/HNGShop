import { NextFunction, Request, Response } from 'express'
import { IMAGE_MESSAGES } from '~/constants/messages'
import mediaService from '~/services/media.services'
import productService from '~/services/product.services'

export const createProductImageController = async (req: Request, res: Response, next: NextFunction) => {
  const maxFile = 4
  const folder = 'product/'
  const { product_id } = req.params
  const imageUrls = await mediaService.uploadImage(req, maxFile, folder)
  const imageUrl = Array.isArray(imageUrls) ? imageUrls : [imageUrls]
  const result = await productService.updateProductImage(product_id, imageUrl)
  return res.json({
    message: IMAGE_MESSAGES.ADD_IMAGE_SUCCESS,
    result
  })
}

export const removeProductImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const { image_url } = req.body
  const result = await productService.deleteImageFromProduct({ product_id, image_url })
  return res.json({
    message: IMAGE_MESSAGES.REMOVE_IMAGE_SUCCESS,
    result
  })
}
