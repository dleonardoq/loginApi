import express, { json } from 'express'
import { userRouter } from '../Routers/UserRouter.js'

const app = express()
app.disable('x-powered-by')

app.use(json())
app.use('/user', userRouter())

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
