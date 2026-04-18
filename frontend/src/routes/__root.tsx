import { Suspense } from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools, ReactQueryDevtools } from '@/lib/devTools'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchUser } from '@/api/auth'


interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    try {
      // Use fetchQuery to ensure we wait for the result
      return await context.queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUser,
        staleTime: Infinity, // Keep the user in memory until logged out or the page is refreshed
      })
    } catch {
      // if a non-auth user attempts to access a protected page, a request to the backend will fail, then _authenticated will redirect the user to the login page, where they will AGAIN request the backend for user data 
      // explicitly setting the user to null in cache here will prevent the 2nd requests to the backend for the user, as the login page will see that the user isn't authenticated
      // at that point, only logging in or registering will update the cache to authorize a user to see the page
      context.queryClient.setQueryData(['auth-user'], null)
      // If unauthorized, the user is null
      return { user: null }
    }
  },
  component: () => (
    <div className="min-h-150 h-screen flex flex-col">
      <Header />
      <main className="flex flex-col grow">
        <Outlet />
      </main>
      <Footer />

      <Suspense>
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </div>
  ),
})