import {Recipient} from "@/types/recipient";


export function interpolate(template: string, data: Recipient): string {
    return template
        .replace(/{{nombre}}/g, data.first_name)
        .replace(/{{apellido}}/g, data.last_name)
        .replace(/{{email}}/g, data.email ?? '')
        .replace(/{{teléfono}}/g, data.phone ?? '')
}