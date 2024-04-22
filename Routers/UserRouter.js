import { Router } from 'express'
import { UserController } from '../Controllers/UserController.js'

export const userRouter = () => {
  const uRouter = Router()

  const userController = new UserController()

  uRouter.get('/', userController.getAll)

  return uRouter
}
