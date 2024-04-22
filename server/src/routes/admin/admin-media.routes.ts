import { Router } from 'express'
import { adminProductImageController } from '~/controllers/media.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { productIdValidator } from '~/middlewares/product.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const adminMediaRouter = Router()

adminMediaRouter.post(
  '/:product_id',
  accessTokenValidator,
  verifiedAdminValidator,
  productIdValidator,
  wrapRequestHandler(adminProductImageController)
)
export default adminMediaRouter
