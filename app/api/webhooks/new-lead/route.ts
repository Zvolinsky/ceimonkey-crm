import { NextRequest } from "next/server"
import { resend } from "@/lib/resend"
import { Lead } from "@/types/lead"

export async function POST(req: NextRequest) {

    const secret = req.headers.get("x-webhook-secret")
    if (secret !== process.env.RESEND_WEBHOOK_SECRET!) {
        return Response.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const lead: Lead = body.record

    try {
        await resend.emails.send({
            from: process.env.FROM_EMAIL!,
            to: process.env.CONTACT_EMAIL!,
            subject: `🆕 Nuevo lead: ${lead.first_name} ${lead.last_name}`,
            html: `
        <h2>Nuevo lead recibido</h2>
        <table cellpadding="6">
          <tr><td><b>Nombre</b></td><td>${lead.first_name} ${lead.last_name}</td></tr>
          <tr><td><b>Email</b></td><td>${lead.email ?? "—"}</td></tr>
          <tr><td><b>Teléfono</b></td><td>${lead.phone ?? "—"}</td></tr>
          <tr><td><b>Fuente</b></td><td>${lead.source ?? "—"}</td></tr>
          <tr><td><b>Estado</b></td><td>${lead.state}</td></tr>
          <tr><td><b>Fecha</b></td><td>${new Date(lead.created_at).toLocaleString("es-ES")}</td></tr>
        </table>
      `,
        })

        return Response.json({ ok: true })
    } catch (err) {
        console.error("Error al enviar la notificación sobre un cliente potencial:", err)
        return Response.json({ error: "Error de envío" }, { status: 500 })
    }
}