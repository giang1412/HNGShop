import adminCategoryRouter from './admin-category.routes'
import adminMediaRouter from './admin-media.routes'
import adminProductRouter from './admin-product.routes'
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
    },
    {
      path: 'products',
      route: adminProductRouter
    },
    {
      path: 'media',
      route: adminMediaRouter
    }
  ]
}

export default adminRoutes
