import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      HEADER<br />
      <Outlet />
      FOOTER<br />

      <TanStackRouterDevtools />
    </>
  ),
})