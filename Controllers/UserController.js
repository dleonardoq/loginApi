import { UserModel } from '../Models/UserModel.js'

export class UserController {
  constructor () {
    this.userModel = new UserModel()
  }

  getAll = async (req, res) => {
    const { status, data } = await this.userModel.getAll()
    return res.status(status).json(data)
  }
}
