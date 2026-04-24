import { createFileRoute, redirect, isRedirect } from '@tanstack/react-router'
import Register from '@/components/Register'
import { Spinner } from '@/components/ui/spinner'
import { fetchHoneypot } from '@/api/auth'

export const Route = createFileRoute('/register/')({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.getQueryData(['auth-user'])

      if (user) { 
        // inside a try/catch block, this throws and error, but we can catch the error type and redirect there!
        throw redirect({ to: '/' }) 
      }
    } catch (err) {
      // If the error is actually a redirect, re-throw the error!
      if (isRedirect(err)) throw err
      return // If there's an error (..amybe a 401), we just ignore it and allow the user to see the register page
    }
  },
  component: Register,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['honeypot'],
      queryFn: fetchHoneypot,
      staleTime: 1000 * 60 * 30, // Keep this key for 30 mins
    });
  },
  pendingComponent: () => <div className="flex justify-center w-full my-16 text-4xl"><Spinner className="size-6" /></div>,
  errorComponent: () => <div className="flex justify-center w-full my-16 text-4xl">Error connecting to the server.</div>,
})