import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { fetchUser } from '@/api/auth'
import Login from '@/components/Login'
import type { QueryClient } from '@tanstack/react-query'

type LoginSearch = {
  redirect?: string
}

export const Route = createFileRoute('/login')({
  // validate and type the search params, for redirecting users to their intended destination after they log in
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search.redirect as string | undefined,
    }
  },
  beforeLoad: async ({ context, search }) => {
    try {
      const user = await (context as { queryClient: QueryClient }).queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUser,
      })
      if (user) { 
        // inside a try/catch block, this throws an error..sending us to 'catch (err)', but we can catch the error type and redirect there!
        throw redirect({ 
          to: search.redirect || '/dashboard'
        })
      }
    } catch (err) {
      // If the error is actually a redirect, re-throw the error!
      if (isRedirect(err)) throw err
      return // They are a guest (401), so stay on the login page.
    }
  },
  component: Login,
})