import { createFileRoute, redirect } from '@tanstack/react-router'
import isAuthenticated from '@/api/auth'
import Register from '@/components/Register'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    const loggedIn = await isAuthenticated()

    if (loggedIn) {
      console.log("User already authenticated, bouncing to home.")
      throw redirect({ to: '/' })
    }
  },
  component: Register,
})