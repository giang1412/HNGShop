import express from 'express'
import userRoutes from './routes/user/index.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import commonRoutes from './routes/common/index.routes'
import { config } from 'dotenv'
import adminRoutes from './routes/admin/index.routes'
import '~/utils/s3'
import { initFolder } from './utils/file'
config()
databaseService.connect()

const port = process.env.PORT || 3400
initFolder()
const app = express()

const routes = [{ ...adminRoutes }, { ...userRoutes }, { ...commonRoutes }]

app.use(express.json())

routes.forEach((item) => item.routes.forEach((route) => app.use(item.prefix + route.path, route.route)))

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
