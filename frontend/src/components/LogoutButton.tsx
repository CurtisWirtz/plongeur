import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'

const useLogout = () => {
  const queryClient = useQueryClient() 
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/accounts/logout/')
      console.log("Successfully logged out:", response)
      return response.data
    },
    onSuccess: () => {
      queryClient.clear() // destroys all cached data 
      navigate({ to: '/login' })
    },
    onError: (error) => {
      console.error("Logout failed:", error)
    }
  })
}

export function LogoutButton() {
  const { mutate, isPending } = useLogout()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault() // Stop the page from reloading on form submission, we'll manually redirect on success
    mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <button 
        type="submit" 
        disabled={isPending}
        className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
      >
        {isPending ? 'Logging out...' : 'Logout'}
      </button>
    </form>
  )
}

export default LogoutButton