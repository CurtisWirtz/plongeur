import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '@/api/auth'

export const useAuth = () => {
  console.log("firing useAuth hook")
  return useQuery({
      queryKey: ['auth-user'],
      queryFn: fetchUser,
      retry: false, 
      staleTime: Infinity, // Keep the user in memory until logged out or the page is refreshed, otherwise we get duplicate requests to the backend for the user, even though the auth data is already in the cache
      placeholderData: null, // if the user data is wiped null, the hook doesn't accidentally trigger a global (e.g. the header) loading state.
      enabled: false
  })
}