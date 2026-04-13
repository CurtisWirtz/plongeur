import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '@/api/auth'

export const useAuth = () => {
  return useQuery({
      queryKey: ['auth-user'],
      queryFn: fetchUser,
      retry: false, 
      staleTime: Infinity, // Keep the user in memory until logged out or the page is refreshed, otherwise we get duplicate requests to the backend for the user, even though the auth data is already in the cache
  })
}