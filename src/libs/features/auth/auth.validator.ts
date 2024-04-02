import zod from 'zod';
import { zodResolver } from '~/helpers/utils';

const email = zod.string().email().min(1, '*required');

const password = zod
  .string()
  .min(6, 'Password must contain at least 6 character(s)')
  .min(1, '*required');

export const signInSchema = zodResolver(
  zod.object({
    email,
    password,
  })
);

export const registerSchema = zodResolver(
  zod
    .object({
      name: zod.string().min(1, '*required'),
      email,
      password,
      confirm_password: zod.string().min(1, '*required'),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ['confirm_password'],
    })
);

export const forgotPasswordSendOTPSchema = zodResolver(
  zod.object({
    email,
  })
);

export const checkOTPSchema = zodResolver(
  zod.object({
    email,
    code: zod.string().min(1, '*required'),
  })
);

export const changePasswordSchema = zodResolver(
  zod
    .object({
      oldPassword: password,
      newPassword: password,
      confirm_password: zod.string().min(1, '*required'),
    })
    .refine((data) => data.newPassword === data.confirm_password, {
      message: "Passwords don't match",
      path: ['confirm_password'],
    })
);

export const resetPasswordSchema = zodResolver(
  zod
    .object({
      email,
      code: zod.string().min(1, '*required'),
      password,
      confirm_password: zod.string().min(1, '*required'),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ['confirm_password'],
    })
);

export const contactSendEmailSchema = zodResolver(
  zod.object({
    email,
    subject: zod.string().min(1, '*required'),
    msg: zod.string().min(1, '*required'),
  })
);
