import { createFileRoute } from '@tanstack/react-router'
import api from '../api/client'
import Login from '@/components/Login'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    try {
      console.log("Checking authentication...")
      const response = await api.get('/accounts/user/')
      console.log("User data:", response.data)
    } catch (error) {
      console.error("try/catch failed", error)
    }
  },
  component: Login,
})