import React from 'react'

export const TanStackRouterDevtools = 
  import.meta.env.PROD
    ? () => null // Do not render devtools in production
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )