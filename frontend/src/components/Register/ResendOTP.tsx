import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon, Check, Ban } from "lucide-react"
import { AxiosError } from 'axios'

const ResendOTP = ({ email }: { email: string }) => {
    const queryClient = useQueryClient()

    const { mutate, isPending, isSuccess, error } = useMutation({
        mutationFn: async (email: string) => {
            const cachedHoneypot = queryClient.getQueryData<{ honeypot_key: string }>(['honeypot'])
            const response = await api.post('/accounts/register/reserve-email/', {
                email: email,
                confirm_email: cachedHoneypot?.honeypot_key || "",
                website: ""
            })
            return response.data
        },
        onError: (error: AxiosError<{ OTP: string }>) => {
            console.error("Verification failed:", error);
        },
    })

    const handleResend = () => {
        // Only allow clicking if the user hasn't already successfully resent and aren't currently loading
        if (!isSuccess && !isPending) {
            mutate(email)
        }
    }

    return (
        <Button 
            type="button"
            variant="secondary"
            size="xs"
            onClick={handleResend}
            disabled={isPending || isSuccess || !!error}
            className={`-translate-y-1 text-sm hover:shadow-2xl transition-all duration-300 ${isSuccess && 'bg-green-400'} ${error && 'bg-destructive text-white'}`}
        >          
            {isPending ? (
                    <RefreshCwIcon className="mr-1 h-3 w-3 animate-spin" />
                ) : isSuccess ? (
                    <Check className="mr-1 h-3 w-3" />
                ) : error ? (
                    <Ban className="mr-1 h-3 w-3" />
                ) : (
                    <RefreshCwIcon className="mr-1 h-3 w-3" />
                )}
        
            {isSuccess ? 'Code Sent' : 'Resend Code'}
        </Button>
    )
}

export default ResendOTP