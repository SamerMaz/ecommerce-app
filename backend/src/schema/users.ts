import { z } from 'zod';

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().length(6),
  country: z.string(),
  city: z.string(),
});
