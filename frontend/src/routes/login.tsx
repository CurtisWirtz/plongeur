import { createFileRoute, redirect } from '@tanstack/react-router'
import isAuthenticated from '@/api/auth'
import Login from '@/components/Login'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const loggedIn = await isAuthenticated()

    if (loggedIn) {
      console.log("User already authenticated, bouncing to home.")
      throw redirect({ to: '/' })
    }
  },
  component: Login,
})