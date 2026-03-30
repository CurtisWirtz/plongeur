import { Suspense } from 'react'
import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools, ReactQueryDevtools } from '../lib/devTools'
import Header from '@/components/Header'
import Footer from '@/components/Footer'


export const Route = createRootRoute({
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