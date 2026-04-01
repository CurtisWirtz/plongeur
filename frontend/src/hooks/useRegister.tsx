import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import type { RegisterSchemaType } from '@/schemas/auth'
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

export default useRegister