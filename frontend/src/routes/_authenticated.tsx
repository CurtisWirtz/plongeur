import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    const user = context.queryClient.getQueryData(['auth-user'])
    
    if (!user) {
      // not authenticated, redirect to login page
      throw redirect({ 
        to: '/login',
        search: { // If an unauthorized user tries to access a protected page, we want them to be returned to the original page they wanted to visit after they log in
            // This puts ?redirect=/dashboard in the URL
            redirect: location.href
        } 
      })
    }
  },
})