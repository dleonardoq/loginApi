import { dataConnection } from '../Postgres/dataConection.js'
import { getPsqlClient } from '../Postgres/postgresDB.js'

export class UserModel {
  constructor () {
    this.notAllowedStatus = [500]
  }

  getAll = async () => {
    try {
      const psqlClient = await getPsqlClient(dataConnection)
      await psqlClient.connect()

      const result = await psqlClient.query(
        'SELECT document_type, document_number, first_name, last_name, age, birthdate, email FROM users;'
      )

      psqlClient.end()

      return { status: 200, data: result.rows }
    } catch (error) {
      console.log('Error -> ', error)
      return { status: 500, data: { message: 'Internal server error' } }
    }
  }

  create = async ({ input }) => {
    try {
      const psqlClient = await getPsqlClient(dataConnection)
      await psqlClient.connect()

      const result = await psqlClient.query('SELECT insert_user($1)', [input])

      const { status, data } = result.rows[0].insert_user

      if (this.notAllowedStatus.includes(status)) {
        // TODO: create logs file to add error messages
        console.log(data)
        return { status, data: { message: 'Error when trying to insert user' } }
      }

      psqlClient.end()

      return { status, data }
    } catch (error) {
      console.log('Error -> ', error)
      return { status: 500, data: { message: 'Internal server error' } }
    }
  }
}
