import { loginSchema } from '@/schemas/auth'
import type { LoginSchemaType } from '@/schemas/auth'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useLogin from '@/hooks/useLogin'
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

const Login = () => {
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    shouldFocusError: true, // a11y, focus errors when they occur
  })

  const { mutate, isPending, error } = useLogin()

  const onSubmit = (data: LoginSchemaType) => {
    // Fire the mutation from the useLogin hook
    mutate(data)
  }

  return (
    <section className="container mt-7 md:mt-14">
      <Card className="max-w-100 mx-auto">
        <CardHeader>
          <CardTitle>Login to your account:</CardTitle>
          <CardDescription>
            Enter your credentials
          </CardDescription>
          <CardAction className="flex flex-col text-center">
            <span className='mb-1 text-sm'>New here?</span>
            <Button variant="outline" className="cursor-pointer shadow-2xl" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="login" onSubmit={form.handleSubmit(onSubmit)}>
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
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button form="login" type="submit" className="shadow-2xl" disabled={isPending}>
              {isPending ? <Spinner /> : 'Login'}
            </Button>
            {error?.response?.data?.detail && (
              <FieldError className="text-red-500 text-center mt-2">{error.response.data?.detail}</FieldError>
            )}
          </Field>
        </CardFooter>
      </Card>
    </section>
  )
}

export default Login
