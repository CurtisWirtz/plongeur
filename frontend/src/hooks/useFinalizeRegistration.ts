import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import api from '@/api/client'
import type { FinalizeRegistrationSchemaType } from '@/schemas/auth'
import { AxiosError } from 'axios'

const useFinalizeRegistration = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: FinalizeRegistrationSchemaType) => {
            const response = await api.post('/accounts/register/finalize/', data)
            return response.data
        },
        onSuccess: (data) => {
            console.log("Congratulations, you're a fully vetted user!");

            // No need for an additional auth request, as the user object is already present in the response data
            // Also, no need to invalidate queries for auth-user because the loader guard (/accounts/user) endpoint returns the identically structured user object
            queryClient.setQueryData(['auth-user'], data.user)

            navigate({to: "/dashboard"})
        },
        onError: (error: AxiosError<{ finalize: string }>) => {
            console.error("Verification failed:", error);
        },
    })
}

export default useFinalizeRegistration