import commonAuthRouter from './common-auth.routes'

const commonRoutes = {
  prefix: '/',
  routes: [
    {
      path: '',
      route: commonAuthRouter
    }
  ]
}

export default commonRoutes
