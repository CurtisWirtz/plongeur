import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import type { LoginSchemaType } from '@/schemas/auth'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'


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
        onError: (error: AxiosError<{ detail: string }>) => {
            console.error("Login failed:", error.response?.data?.detail);
        },
    })
}

export default useLogin