import { Suspense } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools, ReactQueryDevtools } from '@/lib/devTools'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchUser } from '@/api/auth'


interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRoute<MyRouterContext>({
  beforeLoad: async ({ context }) => {
    try {
      // Use fetchQuery to ensure we wait for the result
      return await (context as { queryClient: QueryClient }).queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUser,
        staleTime: 5 * 60 * 1000, // Keep the user in memory until logged out or the page is refreshed
      })
    } catch {
      // If unauthorized, the user is null
      return { user: null }
    }
  },
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />

      <Suspense>
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </>
  ),
})