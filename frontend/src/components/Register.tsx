import { registerSchema } from '@/schemas/auth'
import type { RegisterSchemaType } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import useRegister from '@/hooks/useRegister'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

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

const Register = () => {
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
        shouldFocusError: true, // a11y, focus errors when they occur
        defaultValues: {
            email: "",
            confirm_email: "", // honeypot
            website: "", // honeypot
            password: "",
            confirm_password: "",
        }
    })

    const {mutate, isPending, error} = useRegister()

    const onSubmit = (data: RegisterSchemaType) => {
        // Fire the mutation from the useRegister hook
        mutate(data)
    }

    // Simply capitalizes the first letter on error reports
    function capitalized(str: string): string {
        // get the first character and capitalize it
        const firstChar: string = str[0][0].toUpperCase()
        // concatenate the capitalized first character with the rest of the string
        return firstChar + str[0].slice(1);
    }

    return (
        <section className="container relative w-full h-full">
            <Card className="max-w-100 w-full absolute top-1/2 left-1/2 -translate-1/2">
                <CardHeader>
                    <CardTitle>Create an account:</CardTitle>
                    <CardDescription>
                        Choose your credentials 
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
                                    <FieldLabel htmlFor="email">E-Mail</FieldLabel>
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

export default Register