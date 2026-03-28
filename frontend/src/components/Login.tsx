import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import { loginSchema } from '@/schemas/auth'
import type { LoginSchemaType } from '@/schemas/auth'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginSchemaType) => {
    // Fire the mutation from the useLogin hook
    mutate(data)
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '300px' }}>
      <h3>Please Log In</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input 
            {...register('email')} 
            type="email" 
            placeholder="Email" 
          />
          {errors.email && (
            <p style={{ color: 'orange', fontSize: '0.8rem' }}>{errors.email.message}</p>
          )}
        </div>

        <br />
        
        <div>
          <input 
            {...register('password')} 
            type="password" 
            placeholder="Password" 
          />
          {errors.password && (
            <p style={{ color: 'orange', fontSize: '0.8rem' }}>{errors.password.message}</p>
          )}
        </div>

        <br />

        <button type="submit" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Login Failed: {error.message}</p>}
    </div>
  )
}

export default Login
