'use client'

import { useState, useMemo, useCallback } from 'react'
import { DataTable } from '@/components/dashboard/DataTable'
import { EmailComposer } from '@/components/dashboard/EmailComposer'
import { createLeadColumns } from './columns'
import { Lead } from '@/types/lead'

interface Props {
    leads: Lead[]
}

export function LeadsWrapper({ leads }: Props) {
    const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])
    const [isComposerOpen, setIsComposerOpen] = useState(false)

    const handleStateChange = useCallback((lead: Lead, newState: string) => {
        if (newState === 'Matriculado') {
            console.log('Lead gotowy do konwersji:', lead)
        }
    }, [])

    const columns = useMemo(
        () => createLeadColumns(handleStateChange),
        [handleStateChange]
    )

    function handleSendEmails(recipients: Lead[]) {
        const withEmail = recipients.filter(r => !!r.email)
        if (withEmail.length === 0) return
        setSelectedLeads(withEmail)
        setIsComposerOpen(true)
    }

    return (
        <>
            <DataTable
                data={leads}
                columns={columns}
                onSendEmails={handleSendEmails}
                groupingOptions={[
                    { value: 'state', label: 'Agrupar por estado' },
                    { value: 'source', label: 'Agrupar por fuente' },
                ]}
                searchPlaceholder="Buscar por nombre, email, teléfono..."
                sendButtonLabel="Enviar correos"
            />
            <EmailComposer
                isOpen={isComposerOpen}
                onClose={() => setIsComposerOpen(false)}
                recipients={selectedLeads}
            />
        </>
    )
}