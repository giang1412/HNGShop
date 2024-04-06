import { Router } from 'express'
import { loginController, refreshTokenController, registerController } from '~/controllers/auth.controller'
import { loginValidator, refreshTokenValidator, registerValidator } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const commonAuthRouter = Router()

commonAuthRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

commonAuthRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

commonAuthRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
export default commonAuthRouter
