'use client'

import { useState, useMemo, useCallback } from 'react'
import { DataTable } from '@/components/dashboard/DataTable'
import { EmailComposer } from '@/components/dashboard/EmailComposer'

import { createLeadColumns } from './columns'
import { Lead } from '@/types/lead'
import {useEmailComposer} from "@/hooks/useEmailComposer";
import {ConversionModal} from "@/app/dashboard/leads/components/ConversionModal";

interface Props {
    leads: Lead[]
}

export function LeadsWrapper({ leads }: Props) {
    const { selectedRecipients, isComposerOpen, openComposer, closeComposer } = useEmailComposer();

    const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null)

    const handleStateChange = useCallback((lead: Lead, newState: string) => {
        if (newState === 'Matriculado') {
            setLeadToConvert(lead)
        }
    }, [])

    const columns = useMemo(
        () => createLeadColumns(handleStateChange),
        [handleStateChange]
    )

    return (
        <>
            <DataTable
                data={leads}
                columns={columns}
                onSendEmails={openComposer}
                groupingOptions={[
                    { value: 'state', label: 'Agrupar por estado' },
                    { value: 'source', label: 'Agrupar por fuente' },
                ]}
                searchPlaceholder="Buscar por nombre, email, teléfono..."
                sendButtonLabel="Enviar correos"
            />
            <EmailComposer
                isOpen={isComposerOpen}
                onClose={closeComposer}
                recipients={selectedRecipients}
            />
            <ConversionModal
                lead={leadToConvert}
                onClose={() => setLeadToConvert(null)}
            />
        </>
    )
}