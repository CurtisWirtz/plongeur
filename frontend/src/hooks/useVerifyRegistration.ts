import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import type { VerifyRegistrationSchemaType } from '@/schemas/auth'
import { AxiosError } from 'axios'

const useVerifyRegistration = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (data: VerifyRegistrationSchemaType) => {
            const response = await api.post('/accounts/register/verify/', data)
            return response.data
        },
        onSuccess: () => {
            console.log("Verification success! Enter your credentials to finalize your account setup!");
            navigate({to: "/register/finalize"})
        },
        onError: (error: AxiosError<{ OTP: string }>) => {
            console.error("Verification failed:", error);
        },
    })
}

export default useVerifyRegistration