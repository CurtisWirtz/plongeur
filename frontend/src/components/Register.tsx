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
    })

    const {mutate, isPending, error} = useRegister()

    const onSubmit = (data: RegisterSchemaType) => {
        // Fire the mutation from the useRegister hook
        mutate(data)
    }

    function capitalized(str: string): string {
        // get the first character and capitalize it
        const firstChar: string = str[0][0].toUpperCase()
        // concatenate the capitalized first character with the rest of the string
        return firstChar + str[0].slice(1);
    }

    return (
        <section className="container mt-7 md:mt-14">
            <Card className="max-w-100 mx-auto">
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
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
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
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                                )}
                            />
                            <Controller 
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                    <Input 
                                        {...field} 
                                        id="confirmPassword"
                                        aria-invalid={fieldState.invalid}
                                        type="password" 
                                        placeholder="Confirm Password" 
                                        required
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
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
                            {isPending ? <Spinner /> : 'Login'}
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