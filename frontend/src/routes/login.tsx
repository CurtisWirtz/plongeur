import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { fetchUser } from '@/api/auth'
import Login from '@/components/Login'
import type { QueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    try {
      const user = await (context as { queryClient: QueryClient }).queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUser,
      })
      if (user) { 
        // inside a try/catch block, this throws and error, but we can catch the error type and redirect there!
        throw redirect({ to: '/' }) 
      }
    } catch (err) {
      // If the error is actually a redirect, re-throw the error!
      if (isRedirect(err)) throw err
      return // They are a guest (401), so stay on the login page.
    }
  },
  component: Login,
})