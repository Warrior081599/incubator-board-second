import bcrypt from "bcryptjs";
import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Invalid Email Formate"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string(),
    name: z.string().min(4, "Name must be of atleast 4 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signinSchema = z.object({
  email: z.string().email("Invalid email formate"),
  password: z.string().min(1, "Password is required"),
});

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
