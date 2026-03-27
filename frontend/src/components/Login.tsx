import { useNavigate } from '@tanstack/react-router'
import api from '../api/client'
// import loginSchema from '../schemas/auth'
import type { LoginSchemaType } from '../schemas/auth'
import { useMutation } from '@tanstack/react-query'

const useLogin = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (data: LoginSchemaType) => {
            const response = await api.post('/accounts/login/', data)
            return response.data
        },
        onSuccess: (data) => {
            console.log("Login successful:", data);
            navigate({to: "/"})
        },
        onError: (error) => {
            console.error("Login failed:", error);
        },
    })
}

const Login = () => {
  const { mutate, isPending, error } = useLogin()

  const handleRawSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Fire the mutation from the useLogin hook
    mutate({ email, password })
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '300px' }}>
      <h3>Login (Basic Version)</h3>
      <form onSubmit={handleRawSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <br /><br />
        <input name="password" type="password" placeholder="Password" required />
        <br /><br />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Connecting...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Login Failed: {error.message}</p>}
    </div>
  )
}

export default Login
