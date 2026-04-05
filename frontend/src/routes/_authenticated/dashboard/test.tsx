import { useAuth } from '@/hooks/useAuth'

export default function TestComponent() {
  const user = useAuth()
  console.log("user", user)
  
  return (
    <div className="flex flex-col">
      <h1>Hello "/_authenticated/test/"!</h1>
      {user && <p>Welcome, {user.data?.email}!</p>}
    </div>
  )
}