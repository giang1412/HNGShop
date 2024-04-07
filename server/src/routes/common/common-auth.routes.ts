import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/auth.controller'
import {
  accessTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailTokenValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const commonAuthRouter = Router()

commonAuthRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

commonAuthRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

commonAuthRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

commonAuthRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

commonAuthRouter.post('/oauth/google', wrapRequestHandler(oauthController))

commonAuthRouter.post('/verify-email', verifyEmailTokenValidator, wrapRequestHandler(verifyEmailController))

commonAuthRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

commonAuthRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

commonAuthRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

export default commonAuthRouter
