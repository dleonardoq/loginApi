import { UserModel } from '../Models/UserModel.js'
import { validatePartialUser, validateUser } from '../Schemas/validateUser.js'

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

  update = async (req, res) => {
    const result = validatePartialUser({ input: req.body })

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const { status, data } = await this.userModel.update({ id, input: result.data })

    return res.status(status).json(data)
  }
}