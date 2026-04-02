import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '@/api/auth'

export const useAuth = () => {
  return useQuery({
      queryKey: ['auth-user'],
      queryFn: fetchUser,
      retry: false, 
      staleTime: Infinity, // Keep the user in memory until logged out or the page is refreshed
      placeholderData: null, // if the data is wiped null, the hook doesn't accidentally trigger a global (e.g. the header) loading state.
  })
}