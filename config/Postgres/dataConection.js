import {
  POSTGRES_DB,
  POSTGRES_DB_DEV,
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_HOST_DEV,
  POSTGRES_PASS,
  POSTGRES_PORT,
  POSTGRES_USER
} from '../configVariables.js'

export const dataConnection = {
  host: NODE_ENV !== 'production' ? POSTGRES_HOST_DEV : POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: NODE_ENV !== 'production' ? POSTGRES_DB_DEV : POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASS
}
