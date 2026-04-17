import client from './client'

export const getMe = async () => {
  const { data } = await client.get('/_allauth/browser/v1/auth/session')
  return data // { id, email, first_name, last_name }
}

export const login = async (email, password) => {
  const { data } = await client.post('/_allauth/browser/v1/auth/login', { email, password })
  return data
}

export const logout = async () => {
  await client.delete('/_allauth/browser/v1/auth/session')
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
