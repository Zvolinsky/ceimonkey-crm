import { useState } from 'react'
import {Recipient} from "@/types/recipient";

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

    return { selectedRecipients, isComposerOpen, openComposer, closeComposer }
}