import express from 'express'
import userRoutes from './routes/user/index.route'
const app = express()
const port = 3400
const routes = [{ ...userRoutes }]
app.post('/', (req, res) => {
  res.send('hello world')
})

routes.forEach((item) => item.routes.forEach((route) => app.use(item.prefix + route.path, route.route)))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
