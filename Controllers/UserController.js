import { UserModel } from '../Models/UserModel.js'
import { validateUser } from '../Schemas/validateUser.js'

export class UserController {
  constructor () {
    this.userModel = new UserModel()
  }

  getAll = async (req, res) => {
    const { status, data } = await this.userModel.getAll()
    return res.status(status).json(data)
  }

  create = async (req, res) => {
    const result = validateUser({ input: req.body })

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const { status, data } = await this.userModel.create({ input: result.data })

    return res.status(status).json(data)
  }
}
