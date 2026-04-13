import { useQueryClient } from '@tanstack/react-query'

export default function TestComponent() {
  
  const queryClient = useQueryClient()
  const user: { email: string } | null | undefined = queryClient.getQueryData(['auth-user'])

  return (
    <div className="flex flex-col">
      <h1>Hello "/_authenticated/test/"!</h1>
      {user && <p>Welcome, {user.email}!</p>}
    </div>
  )
}