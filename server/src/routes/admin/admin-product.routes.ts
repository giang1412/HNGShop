import { Router } from 'express'
import { addProductController, getProductController, getProductsController } from '~/controllers/product.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { productIdValidator } from '~/middlewares/product.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const adminProductRouter = Router()

adminProductRouter.post('/', accessTokenValidator, verifiedAdminValidator, wrapRequestHandler(addProductController))

adminProductRouter.get('/', accessTokenValidator, verifiedAdminValidator, wrapRequestHandler(getProductsController))
adminProductRouter.get(
  '/:product_id',
  accessTokenValidator,
  verifiedAdminValidator,
  productIdValidator,
  wrapRequestHandler(getProductController)
)
export default adminProductRouter
