'use client'

import { useState } from 'react'
import { DataTable } from '@/components/dashboard/DataTable'      // ← nowa ścieżka
import { EmailComposer } from '@/components/dashboard/EmailComposer' // ← nowa ścieżka
import { caregiverColumns } from './columns'                        // ← importuj kolumny
import { Caregiver } from '@/types/caregiver'

interface Props {
    caregivers: Caregiver[]
}

export function EmailComposerWrapper({ caregivers }: Props) {
    const [selectedRecipients, setSelectedRecipients] = useState<Caregiver[]>([])
    const [isComposerOpen, setIsComposerOpen] = useState(false)

    function handleSendEmails(recipients: Caregiver[]) {
        setSelectedRecipients(recipients)
        setIsComposerOpen(true)
    }

    return (
        <>
            <DataTable
                data={caregivers}
                columns={caregiverColumns}                        // ← teraz jako prop
                onSendEmails={handleSendEmails}
                groupingOptions={[
                    { value: 'active', label: 'Agrupar por estado' },
                ]}
                searchPlaceholder="Buscar por nombre, email..."
            />
            <EmailComposer
                isOpen={isComposerOpen}
                onClose={() => setIsComposerOpen(false)}
                recipients={selectedRecipients}
            />
        </>
    )
}