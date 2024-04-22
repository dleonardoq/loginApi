import { dataConnection } from '../Postgres/dataConection.js'
import { getPsqlClient } from '../Postgres/postgresDB.js'

export class UserModel {
  getAll = async () => {
    try {
      const psqlClient = await getPsqlClient(dataConnection)
      await psqlClient.connect()

      const result = await psqlClient.query('SELECT * FROM users;')

      psqlClient.end()

      return { status: 200, data: result }
    } catch (error) {
      console.log('Error -> ', error)
      return { status: 500, data: { message: 'Internal server error' } }
    }
  }
}
