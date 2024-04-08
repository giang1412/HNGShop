import commonAuthRouter from './common-auth.routes'
import commonUserRouter from './common-user.routes'

const commonRoutes = {
  prefix: '/',
  routes: [
    {
      path: '',
      route: commonAuthRouter
    },
    {
      path: '',
      route: commonUserRouter
    }
  ]
}

export default commonRoutes
