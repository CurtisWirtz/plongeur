import React from 'react'

// TanStack Router Devtools
export const TanStackRouterDevtools = 
  import.meta.env.PROD
    ? () => null // Do not render devtools in production
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

// TanStack Query Devtools
export const ReactQueryDevtools = 
  import.meta.env.PROD
    ? () => null // Do not render devtools in production
    : React.lazy(() =>
        import('@tanstack/react-query-devtools').then((res) => ({
          default: res.ReactQueryDevtools,
        })),
      )