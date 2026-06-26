import { z } from 'zod'

export const caregiverSchema = z.object({
    first_name: z.string().min(2, 'Mínimo 2 caracteres'),
    last_name:  z.string().min(2, 'Mínimo 2 caracteres'),
    email:      z.string().email('Email inválido'),
    phone:      z.string().or(z.literal('')),
    registration_status: z.enum(['Matriculada', 'No matriculada']),
    services:        z.array(z.string()),
    age_groups: z.array(z.string()),
})

export const leadSchema = z
    .object({
        first_name: z.string().min(2, 'Mínimo 2 caracteres'),
        last_name:  z.string().min(2, 'Mínimo 2 caracteres'),
        email:      z.string().email('Email inválido').or(z.literal('')),
        phone:      z.string().or(z.literal('')),
        source:     z.string().optional(),
        state:      z.string(),
    })
    .superRefine((data, ctx) => {
        if (!data.email && !data.phone) {
            const msg = 'Proporciona al menos teléfono o email'
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: ['email'] })
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: ['phone'] })
        }
    })