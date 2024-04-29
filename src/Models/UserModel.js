import { dataConnection } from '../../config/Postgres/dataConection.js'
import { getPsqlClient } from '../../config/Postgres/postgresDB.js'
import { createHash } from 'node:crypto'
import { JWT_EXPIRES, JWT_KEY } from '../../config/configVariables.js'
import { logger } from '../../Utils/createLogger.js'
import jwt from 'jsonwebtoken'

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
      logger.error('Error ->', error)
      return { status: 500, data: { message: 'Internal server error' } }
    }
  }

  create = async ({ input }) => {
    try {
      const psqlClient = await getPsqlClient(dataConnection)
      await psqlClient.connect()

      const result = await psqlClient.quesry('SELECT insert_user($1)', [input])

      const { status, data } = result.rows[0].insert_user

      if (this.notAllowedStatus.includes(status)) {
        logger.error(data)
        return { status, data: { message: 'Error when trying to insert user' } }
      }

      psqlClient.end()

      return { status, data }
    } catch (error) {
      logger.error('Error ->', error)
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
        logger.error(data)
        return { status, data: { message: 'Error when trying to update user' } }
      }

      psqlClient.end()

      return { status, data }
    } catch (error) {
      logger.error('Error ->', error)
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
        logger.error(data)
        return { status, data: { message: 'Error when trying to update user' } }
      }

      psqlClient.end()

      return { status, data }
    } catch (error) {
      logger.error('Error ->', error)
      return { status: 500, data: { message: 'Internal server error' } }
    }
  }

  login = async ({ input }) => {
    try {
      const psqlClient = await getPsqlClient(dataConnection)
      await psqlClient.connect()

      input.user_password =
      createHash('sha256')
        .update(`${input.user_password}-2024`)
        .digest('hex')

      const result =
      await psqlClient
        .query(
          `SELECT U.first_name || ' ' || U.last_name AS full_name,
            U.email,
            U.document_number
          FROM users U
          WHERE EXISTS(
            SELECT 1
            FROM credentials C
            WHERE C.fk_users = U.id
            AND C.user_name = $1
            AND C.user_password = $2
          );`,
          [input.email, input.user_password]
        )

      psqlClient.on('error', (err) => {
        logger.error('Error -> ', err)
        return { status: 500, data: { message: 'Internal server error' } }
      })

      psqlClient.end()

      if (!result.rowCount) {
        return { status: 401, data: { message: 'Incorrect user name or password' } }
      }

      const userData = result.rows[0]

      const token = jwt.sign({ id: userData.document_number }, JWT_KEY, { expiresIn: JWT_EXPIRES })

      userData.jwt = token

      return { status: 200, data: userData }
    } catch (error) {
      logger.error('Error ->', error)
      return { status: 500, data: { message: 'Internal server error' } }
    }
  }
}
