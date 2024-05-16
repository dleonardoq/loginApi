import { app, server } from '../app.js'
import request from 'supertest'

const api = request(app)

describe('Users endpoints', () => {
  test('Users are returned as json', async () => {
    await api
      .get('/user')
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  server.close()
})
