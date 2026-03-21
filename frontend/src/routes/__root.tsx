import { Suspense } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '../lib/devTools'

export const Route = createRootRoute({
  component: () => (
    <>
      HEADER<br />
      <Outlet />
      FOOTER<br />

      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
})