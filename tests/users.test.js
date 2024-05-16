import { app, server } from '../app.js'
import request from 'supertest'

const api = request(app)

let jwt

test('Jwt is returned in login endpoint', async () => {
  const result = await api
    .post('/user/login')
    .send(
      {
        email: 'admin@admin.com',
        user_password: 'AdminPasS'
      }
    )

  // get jwt for testint the rest of jest test
  jwt = result.body.jwt
})

describe('/user endpoint', () => {
  test('Users are returned as json', async () => {
    await api
      .get('/user')
      .set('Authorization', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('validate first user created by default, user admin', async () => {
    const response = await api.get('/user').set('Authorization', jwt)

    expect(response.body[0].first_name).toBe('admin')
    expect(response.body[0].last_name).toBe('admin')
  })
})

afterAll(() => {
  server.close()
})
