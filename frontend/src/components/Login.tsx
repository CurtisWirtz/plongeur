import { loginSchema } from '@/schemas/auth'
import type { LoginSchemaType } from '@/schemas/auth'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from "@/components/ui/spinner"
import { useNavigate, useSearch } from '@tanstack/react-router'
import api from '@/api/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
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


const useLogin = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // Search params from the current route, if the user tried to access a protected route while not logged in, we'll redirect them there after they successfully login
    const search = useSearch({ from: '/login' })

    return useMutation({
        mutationFn: async (data: LoginSchemaType) => {
            const response = await api.post('/accounts/login/', data)
            return response.data
        },
        onSuccess: (data) => {
            console.log("Login successful:", data);
            // Update the auth-user query with the logged-in User object/data
            queryClient.setQueryData(['auth-user'], data.user) 
            
            // If search.redirect exists, use that's where we'll send the user after logging in. Otherwise, redirect them to root
            const destination = search.redirect || '/dashboard'
            console.log(`Login success! Redirecting to: ${destination}`)
            navigate({ to: destination })
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            console.error("Login failed:", error.response?.data?.detail);
        },
    })
}

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
    <section className="container relative w-full h-full">
      <Card className="max-w-100 w-full absolute top-1/2 left-1/2 -translate-1/2">
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
                      <FieldError className="text-red-500" errors={[fieldState.error]} />
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
