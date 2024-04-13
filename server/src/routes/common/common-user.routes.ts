import { Router } from 'express'
import {
  changePasswordController,
  getMeController,
  updateMeController,
  uploadAvatarController
} from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { changePasswordValidator, updateMeValidator, verifiedUserValidator } from '~/middlewares/user.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handler'

const commonUserRouter = Router()

commonUserRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

commonUserRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>(['name', 'date_of_birth', 'phone', 'avatar', 'address']),
  wrapRequestHandler(updateMeController)
)

commonUserRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

commonUserRouter.post(
  '/upload-avatar',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadAvatarController)
)
export default commonUserRouter
