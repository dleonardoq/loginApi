import { Router } from 'express'
import { UserController } from '../Controllers/UserController.js'

export const userRouter = () => {
  const uRouter = Router()

  const userController = new UserController()

  uRouter.get('/', userController.getUsers)
  uRouter.post('/', userController.create)
  uRouter.patch('/:id', userController.update)
  uRouter.delete('/:id', userController.delete)

  return uRouter
}
