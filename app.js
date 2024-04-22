import express, { json } from 'express'
import { getPsqlClient } from './Postgres/postgresDB.js'
import { dataConnection } from './Postgres/dataConection.js'

const app = express()
app.disable('x-powered-by')
app.use(json())

app.get('/user/', async (req, res) => {
  const psqlClient = await getPsqlClient(dataConnection)
  await psqlClient.connect()

  const result = await psqlClient.query('SELECT * FROM users;')
  console.log(result)

  res.status(200).json(result)
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
