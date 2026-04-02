import { Suspense } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools, ReactQueryDevtools } from '@/lib/devTools'
import Header from '@/components/Header'
import Footer from '@/components/Footer'


interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRoute<MyRouterContext>({
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