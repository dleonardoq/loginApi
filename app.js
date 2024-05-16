import express, { json } from 'express'
import { userRouter } from './src/Routers/UserRouter.js'

export const app = express()
app.disable('x-powered-by')

app.use(json())
app.use('/user', userRouter())

const PORT = process.env.PORT ?? 3000
export const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
