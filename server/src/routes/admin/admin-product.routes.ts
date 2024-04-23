import { Router } from 'express'
import { addProductController } from '~/controllers/product.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const adminProductRouter = Router()

adminProductRouter.post('/', accessTokenValidator, verifiedAdminValidator, wrapRequestHandler(addProductController))
export default adminProductRouter
