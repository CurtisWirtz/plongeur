import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import type { RegisterSchemaType } from '@/schemas/auth'
import { AxiosError } from 'axios'

const useRegister = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: RegisterSchemaType) => {
            const response = await api.post('/accounts/register/', data)
            return response.data
        },
        onSuccess: (data) => {
            console.log("Registration successful:", data);
            // Update the auth-user query with the newly registered User object/data
            queryClient.setQueryData(['auth-user'], data)
            // ensure the session is synced in the background
            queryClient.invalidateQueries({ queryKey: ['auth-user'] })
            navigate({to: "/dashboard"})
        },
        onError: (error: AxiosError<{ email: string }>) => {
            console.error("Registration failed:", error.response?.data);
        },
    })
}

export default useRegister