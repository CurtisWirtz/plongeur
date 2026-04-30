import { useLoaderData, Link } from '@tanstack/react-router'
import { verifyRegistrationSchema } from '@/schemas/auth'
import type { VerifyRegistrationSchemaType } from '@/schemas/auth'
import useVerifyRegistration from '@/hooks/useVerifyRegistration'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { capitalized } from '@/lib/utils'
import { RefreshCwIcon } from "lucide-react"

import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { 
  Field,
  FieldLabel,
  FieldError,
  FieldGroup
} from '@/components/ui/field'
import { Spinner } from "@/components/ui/spinner"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"


const VerifyRegistration = () => {
    // Will contain the email being verified
    const loaderData = useLoaderData({ from: "/register/verify/"})

    const form = useForm<VerifyRegistrationSchemaType>({
        resolver: zodResolver(verifyRegistrationSchema),
        shouldFocusError: true, // a11y, focus errors when they occur
        defaultValues: {
            OTP: ""
        }
    })

    const {mutate, isPending, error} = useVerifyRegistration()

    const onSubmit = (data: VerifyRegistrationSchemaType) => {
        // Fire the mutation from the useReserveEmail hook
        console.log('data right b4 mutate', data)
        mutate(data)
    }

    return (
      <section className="container relative w-full h-full">
        <Card className="max-w-100 w-full absolute top-1/2 left-1/2 -translate-1/2">
            <CardHeader className="flex flex-col">
              <CardTitle>Check your e-mail{loaderData.email && ", " + loaderData.email}</CardTitle>
              <CardDescription>
                  Please allow a few minutes for the verification code to arrive in your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="verify" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                          name="OTP"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <div className="flex items-center justify-between">
                                <FieldLabel htmlFor="otp" className="w-full mb-2 justify-center">Enter the verification code:</FieldLabel>
                                <Button variant="secondary" size="xs" type="button" className="-translate-y-1 text-sm hover:shadow-2xl transition-all duration-200 ease-in-out">
                                  <RefreshCwIcon className="mr-1" /> Resend Code
                                </Button>
                              </div>
                              <div className="flex justify-center">
                                <InputOTP
                                  maxLength={6}
                                  {...field}
                                  id="otp"
                                  onComplete={() => form.handleSubmit(onSubmit)()}
                                >
                                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-14 *:data-[slot=input-otp-slot]:text-xl">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                  </InputOTPGroup>
                                </InputOTP>
                              </div>

                              {fieldState.invalid && (
                                <p className="text-destructive text-sm mt-2 text-center">
                                  {fieldState.error?.message}
                                </p>
                              )}
                            </Field>
                          )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field>
                    <Button form="verify" type="submit" className="shadow-2xl" disabled={isPending}>
                        {isPending ? <Spinner /> : 'Verify'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Wrong email? <Link to="/register" className="underline">Start over</Link>
                    </p>

                    {error?.response?.data?.OTP && (
                        <FieldError className="text-red-500 text-center mt-2">{capitalized(error.response.data?.OTP)}</FieldError>
                    )}
                </Field>
            </CardFooter>
        </Card>
      </section>
    )
  }

export default VerifyRegistration