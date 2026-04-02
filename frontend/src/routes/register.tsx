import { createFileRoute, redirect, isRedirect } from '@tanstack/react-router'
import { fetchUser } from '@/api/auth'
import Register from '@/components/Register'
import type { QueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/register')({
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
      return // If there's an error (..amybe a 401), we just ignore it and allow the user to see the register page
    }
  },
  component: Register,
})