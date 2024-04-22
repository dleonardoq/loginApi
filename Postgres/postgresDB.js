import pg from 'pg'

const { Client } = pg

export const getPsqlClient = async ({
  host,
  port,
  database,
  user,
  password
}) => {
  return new Client({
    host,
    port,
    database,
    user,
    password
  })
}
