import z from "zod";

export const registrationSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).trim(),
    email: z.string().email({ error: "Invalid email address" }).trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      })
    .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });



  export type RegisterInput = z.infer<typeof registrationSchema>;

// pick method to create login schema
  // export const loginSchema = registrationSchema.pick({
  //   email: true,
  //   password: true,
  // });

  export const loginSchema = z.object({
    email: z.string().email({ error: "Invalid email address" }).trim(),
    password: z.string().trim().min(1, { message: "Password is required" }),
  });

  export type LoginInput = z.infer<typeof loginSchema>;