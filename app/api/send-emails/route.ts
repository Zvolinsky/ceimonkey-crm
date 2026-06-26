import { resend } from '@/lib/resend'
import { BulkEmail } from '@/emails/BulkEmail'
import { NextRequest } from 'next/server'
import { createElement } from 'react'
import {Recipient} from "@/types/recipient";
import {interpolate} from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { recipients, subject, message } = await req.json()

        if (!recipients?.length || !subject || !message) {
            return Response.json(
                { error: 'Datos que faltan: destinatarios, asunto o mensaje' },
                { status: 400 }
            )
        }

        const emails = recipients.map((r: Recipient) => ({
            from: process.env.FROM_EMAIL!,
            to: process.env.CONTACT_EMAIL!, //r.email,
            subject: interpolate(subject, r),
            react: createElement(BulkEmail, {
                subject: interpolate(subject, r),
                message: interpolate(message, r),
                recipientName: `${r.first_name} ${r.last_name}`,
            }),
        }))

        const batchResult = await resend.batch.send(emails)

        const results = recipients.map((r: Recipient, index: number) => {
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
        console.error('Error al enviar correos electrónicos:', err)
        return Response.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}