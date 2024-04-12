import { Router } from 'express'
import {
  addUserController,
  getUserController,
  getUsersController,
  updateUserController
} from '~/controllers/user.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { addUserValidator, getUserValidator, updateUserValidator } from '~/middlewares/user.middlewares'
import { UpdateUserReqBody } from '~/models/requests/User.requests'
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

adminUserRouter.patch(
  '/:user_id',
  accessTokenValidator,
  verifiedAdminValidator,
  updateUserValidator,
  filterMiddleware<UpdateUserReqBody>([
    'name',
    'date_of_birth',
    'phone',
    'avatar',
    'address',
    'password',
    'confirm_password'
  ]),
  wrapRequestHandler(updateUserController)
)

adminUserRouter.get(
  '/:user_id',
  accessTokenValidator,
  verifiedAdminValidator,
  getUserValidator,
  wrapRequestHandler(getUserController)
)
export default adminUserRouter
