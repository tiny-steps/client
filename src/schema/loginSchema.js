import { z } from "zod"

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})
export const validateLogin = (data) => loginSchema.safeParse(data)
