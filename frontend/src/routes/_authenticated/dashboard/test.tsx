import { useQueryClient } from '@tanstack/react-query'

export default function TestComponent() {
  // const user = null //useAuth() 

  const queryClient = useQueryClient()
  const user: { email: string } | null | undefined = queryClient.getQueryData(['auth-user'])

  console.log("user", user)
  
  return (
    <div className="flex flex-col">
      <h1>Hello "/_authenticated/test/"!</h1>
      {user && <p>Welcome, {user.email}!</p>}
    </div>
  )
}