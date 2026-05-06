import { reserveEmailSchema } from '@/schemas/auth'
import type { ReserveEmailSchemaType } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import useReserveEmail from '@/hooks/useReserveEmail'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchHoneypot } from '@/api/auth'
import { capitalized } from '@/lib/utils'

import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Field,
  FieldLabel,
  FieldError,
  FieldGroup
} from '@/components/ui/field'
import { Spinner } from "@/components/ui/spinner"

const ReserveEmail = () => { 
    const { data: honeypot } = useSuspenseQuery({
        queryKey: ['honeypot'],
        queryFn: fetchHoneypot,
        select: (data) => data?.honeypot_key,
        staleTime: 1000 * 60 * 30, // Keep this key for 30 mins 
    });
   
    const form = useForm<ReserveEmailSchemaType>({
        resolver: zodResolver(reserveEmailSchema),
        shouldFocusError: true, // a11y, focus errors when they occur
        defaultValues: {
            email: "",
            confirm_email: honeypot || "",
            website: "", // also a honeypot
        }
    })

    const {mutate, isPending, error} = useReserveEmail()

    const onSubmit = (data: ReserveEmailSchemaType) => {
        // Validate simple honeypot manually before sending to server
        if (data.website !== "") {
            console.warn("Website field populated, Honeypot triggered.");
            return; // Silent rejection
        }

        // Fire the mutation from the useReserveEmail hook
        mutate(data)
    }

    return (
        <section className="container w-full h-full">
            <Card className="max-w-100 w-full mx-auto my-16">
                <CardHeader>
                    <CardTitle>Signing up is easy:</CardTitle>
                    <CardDescription>
                        First, enter your e-mail
                    </CardDescription>
                    <CardAction className="flex flex-col text-center">
                        <span className='mb-1 text-sm'>Have an account?</span>
                        <Button variant="outline" className="cursor-pointer shadow-2xl" asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form id="register" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller 
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">E-Mail<sup className="-translate-x-1">*</sup></FieldLabel>
                                        <Input 
                                            {...field} 
                                            id="email"
                                            aria-invalid={fieldState.invalid}
                                            type="email" 
                                            placeholder="Email"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-500" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller 
                                name="confirm_email"
                                control={form.control}
                                render={({ field }) => (
                                    <input {...field} id="confirm_email" name="confirm_email" type="email" autoComplete="off" required tabIndex={-1} />
                                )}
                            />
                            <Controller 
                                name="website"
                                control={form.control}
                                render={({ field }) => (
                                    <input {...field} id="website_input" type="text" autoComplete="off" tabIndex={-1} />
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field>
                        <Button form="register" type="submit" className="shadow-2xl" disabled={isPending}>
                            {isPending ? <Spinner /> : 'Register'}
                        </Button>
                        {error?.response?.data?.email && (
                            <FieldError className="text-red-500 text-center mt-2">{capitalized(error.response.data?.email)}</FieldError>
                        )}
                    </Field>
                </CardFooter>
            </Card>
        </section>
    )
}

export default ReserveEmail