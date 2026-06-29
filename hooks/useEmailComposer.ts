import { useState } from 'react'
import {Recipient} from "@/types/recipient";
import { toast } from 'sonner'

export function useEmailComposer<TData extends Recipient>() {
    const [selectedRecipients, setSelectedRecipients] = useState<TData[]>([])
    const [isComposerOpen, setIsComposerOpen] = useState(false)

    function openComposer(recipients: TData[]) {
        const unique = recipients.filter(
            (r, index, self) =>
                index === self.findIndex(t => (t as any).id === (r as any).id)
        )

        const withEmail = unique.filter(r => !!r.email)
        if (withEmail.length === 0) return
        setSelectedRecipients(withEmail)
        setIsComposerOpen(true)
    }

    function closeComposer() {
        setIsComposerOpen(false)
    }

    async function copyEmails(recipients: TData[]) {
        const unique = recipients.filter(
            (r, index, self) =>
                index === self.findIndex(t => t.id === r.id)
        )
        const withEmail = unique.filter(r => !!r.email)

        if (withEmail.length === 0) {
            toast.warning('Ningún destinatario seleccionado tiene email')
            return
        }

        const emailList = withEmail.map(r => r.email).join(', ')

        try {
            await navigator.clipboard.writeText(emailList)
            toast.success(
                `${withEmail.length} email${withEmail.length > 1 ? 's' : ''} copiado${withEmail.length > 1 ? 's' : ''} al portapapeles`
            )
        } catch {
            toast.error('No se pudo copiar al portapapeles')
        }
    }

    return { selectedRecipients, isComposerOpen, openComposer, closeComposer,copyEmails }
}