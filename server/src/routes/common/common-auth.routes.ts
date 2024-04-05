import { Router } from 'express'
import { registerController } from '~/controllers/auth.controller'
import { wrapRequestHandler } from '~/utils/handler'

const commonAuthRouter = Router()

commonAuthRouter.post('/register', wrapRequestHandler(registerController))

export default commonAuthRouter
