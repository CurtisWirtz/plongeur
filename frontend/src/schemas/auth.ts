import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email().min(5, "Email must be at least 5 characters").max(150, "Email must be less than 150 characters"),
  // simple honeypot, needs to be blank on submission
  website: z.string().max(0).optional(),
  password: z.string().min(3, "Password must be at least 3 characters"),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

export const reserveEmailSchema = z.object({
    email: z.email().min(5, "Email must be at least 5 characters").max(150, "Email must be less than 150 characters"),
    // Honeypot trap #1: Simple hidden input that must be blank
    website: z.string().max(0).optional(),
    // Honeypot trap #2: This value must match the "captcha" value generated on the backend and injected via Javascript
    confirm_email: z.string().min(1, "Verification failed."),
});
export type ReserveEmailSchemaType = z.infer<typeof reserveEmailSchema>;

export const verifyRegistrationSchema = z.object({
    OTP: z.string().length(6, "Invalid verification code.").regex(/^[0-9a-fA-F]+$/, "Invalid verification code."),
});
export type VerifyRegistrationSchemaType = z.infer<typeof verifyRegistrationSchema>;

export const registerSchema = z.object({
    email: z.email().min(5, "Email must be at least 5 characters").max(150, "Email must be less than 150 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirm_password: z.string().min(3, "Password must be at least 3 characters"),
    // Honeypot trap #1: Simple hidden input that must be blank
    website: z.string().max(0).optional(),
    // Honeypot trap #2: This value must match the "captcha" value generated on the backend and injected via Javascript
    confirm_email: z.string().min(1, "Verification failed."),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"], // this path will attach the error to the confirmPassword field
});
export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const finalizeRegistrationSchema = z.object({
    email: z.email().min(5, "Email must be at least 5 characters").max(150, "Email must be less than 150 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirm_password: z.string().min(3, "Password must be at least 3 characters"),
    // Honeypot trap #1: Simple hidden input that must be blank
    website: z.string().max(0).optional(),
    // Honeypot trap #2: This value must match the "captcha" value generated on the backend and injected via Javascript
    confirm_email: z.string().min(1, "Verification failed."),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"], // this path will attach the error to the confirmPassword field
});
export type FinalizeRegistrationSchemaType = z.infer<typeof finalizeRegistrationSchema>;