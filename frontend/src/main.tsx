import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './assets/styles/styles.css'

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

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
    context: {
      // The queryClient here is accessed by guards and loaders
      queryClient: typeof queryClient;
    }
  }
}

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