import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import { registerSchema } from '@/schemas/auth'
import type { RegisterSchemaType } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const useRegister = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (data: RegisterSchemaType) => {
            const response = await api.post('/accounts/register/', data)
            return response.data
        },
        onSuccess: (data) => {
            console.log("Registration successful:", data);
            navigate({to: "/"})
        },
        onError: (error) => {
            console.error("Registration failed:", error);
        }
    })
}

const Register = () => {
    const {mutate, isPending, error} = useRegister()

    const { register, handleSubmit, formState: { errors }, } = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = (data: RegisterSchemaType) => {
        // Fire the mutation from the useRegister hook
        mutate(data)
    }

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '300px' }}>
        <h3>Please Register</h3>
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

export default Register