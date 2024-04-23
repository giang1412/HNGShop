import { Router } from 'express'
import { createProductImageController, removeProductImageController } from '~/controllers/media.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { imageUrlValidator, productIdValidator } from '~/middlewares/product.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const adminMediaRouter = Router()

adminMediaRouter.post(
  '/:product_id',
  accessTokenValidator,
  verifiedAdminValidator,
  productIdValidator,
  wrapRequestHandler(createProductImageController)
)

adminMediaRouter.delete(
  '/:product_id',
  accessTokenValidator,
  verifiedAdminValidator,
  productIdValidator,
  imageUrlValidator,
  wrapRequestHandler(removeProductImageController)
)
export default adminMediaRouter
