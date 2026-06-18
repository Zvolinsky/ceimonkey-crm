import { resend } from '@/lib/resend'
import { BulkEmail } from '@/emails/BulkEmail'
import { NextRequest } from 'next/server'
import { createElement } from 'react'
import {Caregiver} from "@/types/caregiver";

function interpolate(template: string, data: Caregiver): string {
    return template
        .replace(/{{nombre}}/g, data.first_name)
        .replace(/{{apellido}}/g, data.last_name)
        .replace(/{{email}}/g, data.email ?? '')
        .replace(/{{teléfono}}/g, data.phone ?? '')
}

export async function POST(req: NextRequest) {
    try {
        const { recipients, subject, message } = await req.json()

        if (!recipients?.length || !subject || !message) {
            return Response.json(
                { error: 'Brakujące dane: recipients, subject lub message' },
                { status: 400 }
            )
        }

        // Buduj spersonalizowane maile dla każdego odbiorcy
        const emails = recipients.map((r: any) => ({
            from: process.env.FROM_EMAIL!,
            to: process.env.CONTACT_EMAIL!, //r.email,
            subject: interpolate(subject, r),
            react: createElement(BulkEmail, {
                subject: interpolate(subject, r),
                message: interpolate(message, r),
                recipientName: `${r.first_name} ${r.last_name}`,
            }),
        }))

        // Jeden request do Resend — wysyła wszystkie naraz
        const batchResult = await resend.batch.send(emails)

        // Mapuj wyniki z powrotem na ID rekordów
        const results = recipients.map((r: any, index: number) => {
            const sent = batchResult.data?.data?.[index]
            return {
                id: r.id,
                email: r.email,
                success: !!sent?.id,
                error: sent ? undefined : 'Error de envío',
            }
        })

        return Response.json({ results })
    } catch (err) {
        console.error('Błąd wysyłki maili:', err)
        return Response.json(
            { error: 'Wewnętrzny błąd serwera' },
            { status: 500 }
        )
    }
}