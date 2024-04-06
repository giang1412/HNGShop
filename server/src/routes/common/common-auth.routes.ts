import { Router } from 'express'
import { loginController, registerController } from '~/controllers/auth.controller'
import { loginValidator, registerValidator } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const commonAuthRouter = Router()

commonAuthRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

commonAuthRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

export default commonAuthRouter
