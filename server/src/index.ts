import express from 'express'
import userRoutes from './routes/user/index.route'
import databaseService from './services/database.services'
const app = express()
const port = 3400
const routes = [{ ...userRoutes }]
app.post('/', (req, res) => {
  res.send('hello world')
})
databaseService.connect()

routes.forEach((item) => item.routes.forEach((route) => app.use(item.prefix + route.path, route.route)))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
