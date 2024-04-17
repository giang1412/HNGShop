import { Router } from 'express'
import { addCategoryController, getCategoriesController } from '~/controllers/category.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { addCategoryValidator } from '~/middlewares/category.middlewares'
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

export default adminCategoryRouter
