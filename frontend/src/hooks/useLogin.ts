import { useNavigate, useSearch } from '@tanstack/react-router'
import api from '@/api/client'
import type { LoginSchemaType } from '@/schemas/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'


const useLogin = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // Search params from the current route, if the user tried to access a protected route while not logged in, we'll redirect them there after they successfully login
    const search = useSearch({ from: '/login' })

    return useMutation({
        mutationFn: async (data: LoginSchemaType) => {
            const response = await api.post('/accounts/login/', data)
            return response.data
        },
        onSuccess: (data) => {
            console.log("Login successful:", data);
            // Update the auth-user query with the logged-in User object/data
            queryClient.setQueryData(['auth-user'], data.user) 
            
            // If search.redirect exists, use that's where we'll send the user after logging in. Otherwise, redirect them to root
            const destination = search.redirect || '/dashboard'
            console.log(`Login success! Redirecting to: ${destination}`)
            navigate({ to: destination })
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            console.error("Login failed:", error.response?.data?.detail);
        },
    })
}

export default useLogin