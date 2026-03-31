import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email().min(5, "Email must be at least 5 characters").max(150, "Email must be less than 150 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.email().min(5, "Email must be at least 5 characters").max(150, "Email must be less than 150 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    password2: z.string().min(3, "Confirm password must be at least 3 characters"),
}).refine((data) => data.password === data.password2, {
  message: "Passwords do not match",
  path: ["password2"], // this path will attach the error to the password2 field
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;