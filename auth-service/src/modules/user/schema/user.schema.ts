import { z } from 'zod';

export const updateUserSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
    gender: z.enum(['MALE', 'FEMALE', 'NULL']).optional(),
}).strict();