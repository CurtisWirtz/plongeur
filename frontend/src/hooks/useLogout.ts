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
      // set auth to null immediately on logout, so UI can react right away
      queryClient.setQueryData(['auth-user'], null) 
      // removes all queries, but preserves client settings
      queryClient.removeQueries()  
      
      navigate({ to: '/login' })
    },
    onError: (error) => {
      console.error("Logout failed:", error)
    }
  })
}

export default useLogout