import { Router } from 'express'
import {
  addProductController,
  getProductController,
  getProductsController,
  updateProductController
} from '~/controllers/product.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { productIdValidator, updateProductValidator } from '~/middlewares/product.middlewares'
import { UpdateProductReqBody } from '~/models/requests/Product.requests'
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

adminProductRouter.put(
  '/:product_id',
  accessTokenValidator,
  verifiedAdminValidator,
  updateProductValidator,
  productIdValidator,
  filterMiddleware<UpdateProductReqBody>([
    'name',
    'category',
    'description',
    'price',
    'price_before_discount',
    'quantity'
  ]),
  wrapRequestHandler(updateProductController)
)
export default adminProductRouter
