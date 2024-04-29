import { UserModel } from '../Models/UserModel.js'
import { validatePartialUser, validateUser } from '../Schemas/validateUserData.js'
import { validateUserLogin } from '../Schemas/validateUserLogin.js'

export class UserController {
  constructor () {
    this.userModel = new UserModel()
  }

  getUsers = async (req, res) => {
    const { id } = req.query ?? false

    const { status, data } = await this.userModel.getUsers({ id })
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

  delete = async (req, res) => {
    const { id } = req.params

    const { status, data } = await this.userModel.delete({ id })

    return res.status(status).json(data)
  }

  login = async (req, res) => {
    const result = validateUserLogin({ input: req.body })

    if (result.error) {
      return { status: 422, data: { error: JSON.parse(result.error.message) } }
    }

    const { status, data } = await this.userModel.login({ input: result.data })

    return res.status(status).json(data)
  }
}
