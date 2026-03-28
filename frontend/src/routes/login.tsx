import { createFileRoute, redirect } from '@tanstack/react-router'
import api from '@/api/client'
import Login from '@/components/Login'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    try {
      console.log("Checking authentication...")
      const response = await api.get('/accounts/user/')
      // If the user is logged in, redirect away from login page
      console.log("User is logged in, redirecting to home page:", response.data)
      throw redirect({ to: '/' })
    } catch (error) {
      console.error("User not authenticated:", error)
    }
  },
  component: Login,
})