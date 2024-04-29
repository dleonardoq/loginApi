import { Router } from 'express'
import { UserController } from '../Controllers/UserController.js'
import { validateAccessToken } from '../Middlewares/validateToken.js'

export const userRouter = () => {
  const uRouter = Router()

  const userController = new UserController()

  uRouter.get('/', validateAccessToken, userController.getUsers)
  uRouter.post('/', validateAccessToken, userController.create)
  uRouter.patch('/:id', validateAccessToken, userController.update)
  uRouter.delete('/:id', validateAccessToken, userController.delete)
  uRouter.post('/login', userController.login)

  return uRouter
}
