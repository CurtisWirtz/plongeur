import { StrictMode } from 'react'
import type { JSX } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './assets/styles/styles.css'
import notFoundComponent from '@/components/404'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// It's important that all queryClient objects use the same instance, for shared cache and state!
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // Don't keep trying if Django says 401
            refetchOnWindowFocus: false, // Don't spam Django when users switch tabs
        },
    },
});

interface RouterContext {
  routeTree: typeof routeTree,
  defaultNotFoundComponent: () => JSX.Element,
  context: {
    queryClient: QueryClient
  }
}

// Create a new router instance
const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: notFoundComponent,
  context: {
    queryClient, // This is where guards and loaders will access the queryClient
  },
} satisfies RouterContext)

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      {/* The queryClient here is accessed by components and hooks */}
      <QueryClientProvider client={queryClient}>
      
        <RouterProvider router={router} />
      
      </QueryClientProvider>
    </StrictMode>,
  )
}