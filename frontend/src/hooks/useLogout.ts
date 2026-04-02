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
      console.log("success in logout")
      // the Header will update based on the auth-user query, so we need to clear that data out on logout
      queryClient.setQueryData(['auth-user'], null)
      // removes all queries, but isn't as nuclear as .clear() which also resets settings and cache config
      queryClient.removeQueries( { queryKey: ['auth-user'] })  
      console.log("aftger invalidating queries")

      navigate({ to: '/login' })
    },
    onError: (error) => {
      console.error("Logout failed:", error)
    }
  })
}

export default useLogout