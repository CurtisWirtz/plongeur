import { createFileRoute, redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { fetchUser } from '@/api/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    try {
      await (context as { queryClient: QueryClient }).queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUser,
      })
    } catch {
      // not authenticated, redirect to login page
      throw redirect({ to: '/login' })
    }
  },
})