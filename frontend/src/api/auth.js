import client from './client'

export const getMe = async () => {
  const { data } = await client.get('/auth/me')
  return data // { id, email, first_name, last_name }
}

export const login = async (username, password) => {
  const { data } = await client.post('/auth/login', { username, password })
  return data
}

export const logout = async () => {
  await client.post('/auth/logout')
}

export const register = async (email, password, firstName, lastName) => {
  const { data } = await client.post('/auth/register', {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  })
  return data
}
