import { Router } from 'express'
import {
  addCategoryController,
  getCategoriesController,
  getCategoryController
} from '~/controllers/category.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { addCategoryValidator, getCategoryValidator } from '~/middlewares/category.middlewares'
import { verifyAccessToken } from '~/utils/common'
import { wrapRequestHandler } from '~/utils/handler'

const adminCategoryRouter = Router()

adminCategoryRouter.post(
  '/',
  accessTokenValidator,
  verifiedAdminValidator,
  addCategoryValidator,
  wrapRequestHandler(addCategoryController)
)

adminCategoryRouter.get('/', accessTokenValidator, verifiedAdminValidator, wrapRequestHandler(getCategoriesController))
adminCategoryRouter.get(
  '/:category_id',
  accessTokenValidator,
  verifiedAdminValidator,
  getCategoryValidator,
  wrapRequestHandler(getCategoryController)
)

export default adminCategoryRouter
