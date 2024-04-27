import { dataConnection } from '../Postgres/dataConection.js'
import { getPsqlClient } from '../Postgres/postgresDB.js'
import { createHash } from 'node:crypto'

export class UserModel {
  constructor () {
    this.notAllowedStatus = [500]
  }

  getUsers = async ({ id }) => {
    if (id && isNaN(id)) {
      return { status: 400, data: { error: 'Id must be a number' } }
    }

    let result
    try {
      const psqlClient = await getPsqlClient(dataConnection)
      await psqlClient.connect()

      if (!id) {
        result = await psqlClient.query('SELECT document_type, document_number, first_name, last_name, age, birthdate, email FROM users;')
      } else {
        result =
        await psqlClient
          .query('SELECT document_type, document_number, first_name, last_name, age, birthdate, email FROM users WHERE document_number = $1;', [id])
      }

      if (result.rows.length === 0) {
        return { status: 404, data: { error: 'Not users found' } }
      }

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

      input.user_password =
      createHash('sha256')
        .update(`${input.user_password}-2024`)
        .digest('hex')

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

  update = async ({ id, input }) => {
    try {
      const psqlClient = await getPsqlClient(dataConnection)
      await psqlClient.connect()

      const result = await psqlClient.query('SELECT update_user($1, $2)', [id, input])
      const { status, data } = result.rows[0].update_user

      if (this.notAllowedStatus.includes(status)) {
        // TODO: create logs file to add error messages
        console.log(data)
        return { status, data: { message: 'Error when trying to update user' } }
      }

      psqlClient.end()

      return { status, data }
    } catch (error) {
      console.log('Error -> ', error)
      return { status: 500, data: { message: 'Internal server error' } }
    }
  }

  delete = async ({ id }) => {
    try {
      const psqlClient = await getPsqlClient(dataConnection)
      await psqlClient.connect()

      const result = await psqlClient.query('SELECT delete_user($1)', [id])
      const { status, data } = result.rows[0].delete_user

      if (this.notAllowedStatus.includes(status)) {
        // TODO: create logs file to add error messages
        console.log(data)
        return { status, data: { message: 'Error when trying to update user' } }
      }

      psqlClient.end()

      return { status, data }
    } catch (error) {
      console.log('Error -> ', error)
      return { status: 500, data: { message: 'Internal server error' } }
    }
  }
}
