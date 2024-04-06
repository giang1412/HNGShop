import { Router } from 'express'
import { registerController } from '~/controllers/auth.controller'
import { registerValidator } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const commonAuthRouter = Router()

commonAuthRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default commonAuthRouter
