import { userUserRouter } from './user-user.routes'

const userRoutes = {
  prefix: '/',
  routes: [
    {
      path: 'user',
      route: userUserRouter
    }
  ]
}

export default userRoutes
