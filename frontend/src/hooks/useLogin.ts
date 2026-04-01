import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import type { LoginSchemaType } from '@/schemas/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'


const useLogin = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: LoginSchemaType) => {
            const response = await api.post('/accounts/login/', data)
            return response.data
        },
        onSuccess: (data) => {
            console.log("Login successful:", data);
            // Update the auth-user query with the logged-in User object/data
            queryClient.setQueryData(['auth-user'], data.user) 
            // other components looking at auth-user will know the data has changed
            queryClient.invalidateQueries({ queryKey: ['auth-user'] })
            
            navigate({to: "/"})
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            console.error("Login failed:", error.response?.data?.detail);
        },
    })
}

export default useLogin