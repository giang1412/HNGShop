import { Router } from 'express'
import { getUsersController } from '~/controllers/user.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const adminUserRouter = Router()
adminUserRouter.get('', accessTokenValidator, verifiedAdminValidator, wrapRequestHandler(getUsersController))
export default adminUserRouter
