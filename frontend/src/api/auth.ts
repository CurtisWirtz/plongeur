import api from '@/api/client'

export const fetchUser = async () => {
  const { data } = await api.get('/accounts/user/')
  return data // Returns the User object
}

export const fetchHoneypot = async () => {
  const { data } = await api.get('/accounts/honeypot/')
  return data
}