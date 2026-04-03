import { createFileRoute, redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { fetchUser } from '@/api/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    try {
      await (context as { queryClient: QueryClient }).queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUser,
      })
    } catch {
      // not authenticated, redirect to login page
      throw redirect({ 
        to: '/login',
        search: { // If an unauthorized user tries to access a protected page, we want them to be returned to the original page they wanted to visit after they log in
            // This puts ?redirect=/dashboard in the URL
            redirect: location.href
        } 
      })
    }
  },
})