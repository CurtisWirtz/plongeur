import { finalizeRegistrationSchema } from '@/schemas/auth'
import type { FinalizeRegistrationSchemaType } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import useFinalizeRegistration from '@/hooks/useFinalizeRegistration'
import { Button } from '@/components/ui/button'
import { useLoaderData } from '@tanstack/react-router'
import { capitalized } from '@/lib/utils'

import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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

const FinalizeRegistration = () => { 
    // Will contain the email being registered
    const loaderData = useLoaderData({ from: "/register/finalize/"})
   
    const form = useForm<FinalizeRegistrationSchemaType>({
        resolver: zodResolver(finalizeRegistrationSchema),
        shouldFocusError: true, // a11y, focus errors when they occur
        defaultValues: {
            email: loaderData.email || "",
            password: "",
            confirm_password: "",
            first_name: "",
            last_name: "",
            phone_number: "",
        }
    })

    const {mutate, isPending, error} = useFinalizeRegistration()

    const onSubmit = (data: FinalizeRegistrationSchemaType) => {
        mutate(data)
    }

    return (
        <section className="container relative w-full h-full">
            <Card className="max-w-100 w-full absolute top-1/2 left-1/2 -translate-1/2">
                <CardHeader>
                    <CardTitle>Finalize your details for your account {loaderData.email && loaderData.email}</CardTitle>
                    <CardDescription>
                        You can easily edit this info at any point in the future, but right now you must set a password!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="register" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller 
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input 
                                            {...field} 
                                            id="password"
                                            aria-invalid={fieldState.invalid}
                                            type="password" 
                                            placeholder="Password"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-500" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller 
                                name="confirm_password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="confirm_password">Confirm Password</FieldLabel>
                                        <Input 
                                            {...field} 
                                            id="confirm_password"
                                            aria-invalid={fieldState.invalid}
                                            type="password" 
                                            placeholder="Confirm Password"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-500" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller 
                                name="first_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="first_name">First Name (optional)</FieldLabel>
                                        <Input 
                                            {...field} 
                                            id="first_name"
                                            aria-invalid={fieldState.invalid}
                                            type="text" 
                                            placeholder="First Name"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-500" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller 
                                name="last_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="last_name">Last Name (optional)</FieldLabel>
                                        <Input 
                                            {...field} 
                                            id="last_name"
                                            aria-invalid={fieldState.invalid}
                                            type="text" 
                                            placeholder="Last Name"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-500" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller 
                                name="phone_number"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="phone_number">Phone Number (optional)</FieldLabel>
                                        <Input 
                                            {...field} 
                                            id="phone_number"
                                            aria-invalid={fieldState.invalid}
                                            type="text" 
                                            placeholder="Phone Number"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-500" errors={[fieldState.error]} />
                                        )}
                                    </Field>
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
                        {error?.response?.data?.finalize && (
                            <FieldError className="text-red-500 text-center mt-2">{capitalized(error.response.data?.finalize)}</FieldError>
                        )}
                    </Field>
                </CardFooter>
            </Card>
        </section>
    )
}

export default FinalizeRegistration