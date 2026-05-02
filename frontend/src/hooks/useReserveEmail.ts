import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import type { ReserveEmailSchemaType } from '@/schemas/auth'
import { AxiosError } from 'axios'

const useReserveEmail = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (data: ReserveEmailSchemaType) => {
            const response = await api.post('/accounts/register/reserve-email/', data)
            return response.data
        },
        onSuccess: () => {
            console.log("E-mail successfully reserved, check your e-mail for the verification code.");
            navigate({to: "/register/verify"})
        },
        onError: (error: AxiosError<{ email: string }>) => {
            console.error("Registration failed:", error);
        },
    })
}

export default useReserveEmail