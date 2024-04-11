import { Router } from 'express'
import { addUserController, getUsersController } from '~/controllers/user.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { addUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const adminUserRouter = Router()
adminUserRouter.get('', accessTokenValidator, verifiedAdminValidator, wrapRequestHandler(getUsersController))

adminUserRouter.post(
  '',
  accessTokenValidator,
  verifiedAdminValidator,
  addUserValidator,
  wrapRequestHandler(addUserController)
)
export default adminUserRouter
