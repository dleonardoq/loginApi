import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASS, POSTGRES_PORT, POSTGRES_USER } from '../Utils/config.js'

export const dataConnection = {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASS
}
