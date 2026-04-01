import { loginSchema } from '@/schemas/auth'
import type { LoginSchemaType } from '@/schemas/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useLogin from '@/hooks/useLogin'


const Login = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    shouldFocusError: true, // a11y, focus errors when they occur
  })

  const { mutate, isPending, error } = useLogin()

  const onSubmit = (data: LoginSchemaType) => {
    // Fire the mutation from the useLogin hook
    mutate(data)
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '300px' }}>
      <h3>Please Log In</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>

          {error?.response?.data?.detail && (
            <p style={{ color: 'red', fontSize: '0.8rem' }}>{error.response.data?.detail}</p>
          )}

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
    </div>
  )
}

export default Login
