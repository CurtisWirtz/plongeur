import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import { registerSchema } from '@/schemas/auth'
import type { RegisterSchemaType } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AxiosError } from 'axios'

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
        onError: (error: AxiosError<{ email: string }>) => {
            console.error("Registration failed:", error.response?.data);
        },
    })
}

const Register = () => {
    const {mutate, isPending, error} = useRegister()

    const { register, handleSubmit, formState: { errors }, } = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
        shouldFocusError: true, // a11y, focus errors when they occur
    })

    const onSubmit = (data: RegisterSchemaType) => {
        // Fire the mutation from the useRegister hook
        mutate(data)
    }

    function capitalized(str: string): string {
        // get the first character and capitalize it
        const firstChar: string = str[0][0].toUpperCase()
        // concatenate the capitalized first character with the rest of the string
        return firstChar + str[0].slice(1);
    }

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '300px' }}>
            <h3>Sign up!</h3>
            <form onSubmit={handleSubmit(onSubmit)}>

                {error?.response?.data?.email && (
                    <p style={{ color: 'red', fontSize: '0.8rem' }}>{capitalized(error.response.data?.email)}</p>
                )}

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

                <div>
                    <input 
                        {...register('confirmPassword')} 
                        type="password" 
                        placeholder="Confirm Password" 
                    />
                    {errors.confirmPassword && (
                        <p style={{ color: 'orange', fontSize: '0.8rem' }}>{errors.confirmPassword.message}</p>
                    )}
                </div>

                <br />

                <button type="submit" disabled={isPending}>
                    {isPending ? 'Signing up...' : 'Sign up'}
                </button>
            </form>
        </div>
    )
}

export default Register