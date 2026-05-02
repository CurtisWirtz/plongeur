import { createFileRoute, redirect } from '@tanstack/react-router'
import api from '@/api/client'
import FinalizeRegistration from '@/components/Register/FinalizeRegistration'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/register/finalize/')({
  loader: async () => {
    try {
      const response = await api.get('/accounts/register/finalize/')

      // check if the backend set finalize to True 
      if (response.data.finalize && response.data.email) {
        return response.data
        
      } else {
        // backend did not set finalize to True (meaning OTP verification happened)
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
  component: FinalizeRegistration,
})