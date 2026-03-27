import { Suspense } from 'react'
import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools, ReactQueryDevtools } from '../lib/devTools'
import LogoutButton from '@/components/LogoutButton'

export const Route = createRootRoute({
  component: () => (
    <>
      HEADER<br />
      <Link to="/">Home</Link><Link to="/login">Login</Link><LogoutButton />
      <br /><br />
      <Outlet />
      FOOTER<br />

      <Suspense>
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </>
  ),
})