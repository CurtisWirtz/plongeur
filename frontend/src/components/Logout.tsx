import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import { Button } from './ui/button'

const useLogout = () => {
  const queryClient = useQueryClient() 
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/accounts/logout/')
      return response.data
    },
    onSuccess: () => {
      // the Header will update based on the auth-user query, so we need to clear that data out on logout
      queryClient.setQueryData(['auth-user'], null)

      navigate({ to: '/login' })
    },
    onError: (error) => {
      console.error("Logout failed:", error)
    }
  })
}

export function Logout() {
  const { mutate, isPending } = useLogout()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault() // Stop the page from reloading on form submission, we'll manually redirect on success
    mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button 
        type="submit" 
        variant="ghost"
        disabled={isPending}
        className="w-full text-center"
      >
        Logout
      </Button>
    </form>
  )
}

export default Logout