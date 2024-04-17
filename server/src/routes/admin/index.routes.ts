import adminCategoryRouter from './admin-category.routes'
import adminUserRouter from './admin-user.routes'

const adminRoutes = {
  prefix: '/admin/',
  routes: [
    {
      path: 'users',
      route: adminUserRouter
    },
    {
      path: 'categories',
      route: adminCategoryRouter
    }
  ]
}

export default adminRoutes
