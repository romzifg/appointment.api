import { z } from 'zod';

const phoneNumberRegex = /^(\+62|62|0)[0-9]{9,13}$/;

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
}).strict();

export const registerSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phoneNumber: z.string().regex(phoneNumberRegex, 'Phone number must be valid Indonesian format (e.g., +628123456789, 08123456789)').optional(),
    gender: z.enum(['MALE', 'FEMALE', 'NULL']).optional(),
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;