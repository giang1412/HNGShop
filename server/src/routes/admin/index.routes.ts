import adminUserRouter from './admin-user.routes'

const adminRoutes = {
  prefix: '/admin/',
  routes: [
    {
      path: 'users',
      route: adminUserRouter
    }
  ]
}

export default adminRoutes
