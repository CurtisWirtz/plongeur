import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'

const useLogout = () => {
  const queryClient = useQueryClient() 
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      return await api.post('/accounts/logout/')
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

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault() // Stop the page from reloading
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