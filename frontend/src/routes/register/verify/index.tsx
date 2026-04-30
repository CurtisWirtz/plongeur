import { createFileRoute, redirect } from '@tanstack/react-router'
import api from '@/api/client'
import VerifyRegistration from '@/components/Register/VerifyRegistration'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/register/verify/')({
  loader: async () => {
    try {
      const response = await api.get('/accounts/register/verify/')

      // check if the backend set verifying to True 
      if (response.data.verifying) {
        return response.data
        
      } else {
        // backend did not set verifying to True
        throw redirect({ 
          to: '/register'}
        )
      }
    } catch (error) {
      console.error('Please enter your e-mail, then the verification code sent to that inbox.', error)
      throw redirect({ 
        to: '/register'}
      )
    }
  },
  pendingComponent: () => <div className="flex justify-center w-full my-16 text-4xl"><Spinner className="size-6" /></div>,
  errorComponent: () => <div className="flex justify-center w-full my-16 text-4xl">Error connecting to the server.</div>,
  component: VerifyRegistration,
})