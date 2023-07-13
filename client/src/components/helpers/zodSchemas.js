import * as z from "zod";
export const loginSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username should be atleast of length 4" }),
  password: z
    .string()
    .min(6, { message: "Password should be atleast of length 6" }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username should be atleast of length 4" }),
    password: z
      .string()
      .min(6, { message: "Password should be atleast of length 6" }),
    confirmpassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });

export const postSchema = z.object({
  title: z.string().min(4, { message: "Title should be atleast 4 chars long" }),
  subtitle: z
    .string()
    .min(4, { message: "Subtitle should be atleast 4 chars long" }),
  cover: z.string().url("Cover img should be a valid URL"),
  content: z.string().nonempty("Content should be non-empty"),
});
