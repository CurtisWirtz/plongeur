import api from '@/api/client'

export const fetchUser = async () => {
  const { data } = await api.get('/accounts/user/')
  return data // Returns the User object
}