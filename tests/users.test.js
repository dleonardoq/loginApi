import { app, server } from '../app.js'
import request from 'supertest'

const api = request(app)

let jwt, documentNumber

test('Jwt is returned in login endpoint', async () => {
  const response = await api
    .post('/user/login')
    .send(
      {
        email: 'admin@admin.com',
        user_password: 'AdminPasS'
      }
    )

  expect(response.status).toBe(200)
  expect(response.header['content-type']).toMatch(/application\/json/)

  // get jwt for testint the rest of jest test
  jwt = response.body.jwt
  documentNumber = response.body.document_number
})

describe('GET /user -- Get users', () => {
  test('Users are returned as an array', async () => {
    const response = await api
      .get('/user')
      .set('Authorization', jwt)

    expect(response.status).toBe(200)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body).toBeInstanceOf(Array)
  })

  test('Admin users is returned correctly, its data is correct', async () => {
    const response = await api
      .get(`/user?id=${documentNumber}`)
      .set('Authorization', jwt)

    expect(response.status).toBe(200)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body[0].first_name).toBe('admin')
    expect(response.body[0].last_name).toBe('admin')
    expect(response.body[0].email).toBe('admin@admin.com')
  })
})

describe('POST /user -- Create a new user', () => {
  test('User created correctly', async () => {
    const response = await api
      .post('/user')
      .set('Authorization', jwt)
      .send(
        {
          document_type: 'CC',
          document_number: 1000001,
          first_name: 'testName',
          last_name: 'testLastName',
          age: 26,
          birthdate: '1999-12-12',
          email: 'testName@gmail.com',
          user_password: 'testPassword'
        }
      )

    expect(response.status).toBe(201)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body.message).toBe('User created')
  })

  test('Get new created user', async () => {
    const response = await api
      .get('/user?id=1000001')
      .set('Authorization', jwt)

    expect(response.status).toBe(200)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body[0].first_name).toBe('testName')
    expect(response.body[0].last_name).toBe('testLastName')
    expect(response.body[0].email).toBe('testName@gmail.com')
  })
})

describe('PATCH /user -- Update user', () => {
  test('Update user information', async () => {
    const response = await api
      .patch('/user/1000001')
      .set('Authorization', jwt)
      .send(
        {
          first_name: 'testName2',
          last_name: 'testLastName2',
          age: 27,
          birthdate: '1998-11-11',
          email: 'testName2@gmail.com'
        }
      )

    expect(response.status).toBe(200)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body.message).toBe('User updated')
  })

  test('Get updated user', async () => {
    const response = await api
      .get('/user?id=1000001')
      .set('Authorization', jwt)

    expect(response.status).toBe(200)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body[0].first_name).toBe('testName2')
    expect(response.body[0].last_name).toBe('testLastName2')
    expect(response.body[0].age).toBe(27)
    expect(response.body[0].birthdate).toMatch(/1998-11-11/)
    expect(response.body[0].email).toBe('testName2@gmail.com')
  })

  test('Update user password', async () => {
    const response = await api
      .patch('/user/1000001')
      .set('Authorization', jwt)
      .send(
        {
          user_password: 'testPassword2'
        }
      )

    expect(response.status).toBe(200)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body.message).toBe('Password updated')
  })
})

describe('DELETE /user -- Delete user', () => {
  test('Delete user', async () => {
    const response = await api
      .delete('/user/1000001')
      .set('Authorization', jwt)

    expect(response.status).toBe(200)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body.message).toBe('User deleted')
  })

  test('Check deleted user', async () => {
    const response = await api
      .get('/user?id=1000001')
      .set('Authorization', jwt)

    expect(response.status).toBe(404)
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body.error).toBe('Not users found')
  })
})

afterAll(() => {
  server.close()
})
