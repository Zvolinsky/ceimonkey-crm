'use client'

import { useState } from 'react'
import { DataTable } from '@/components/dashboard/DataTable'
import { EmailComposer } from '@/components/dashboard/EmailComposer'
import { caregiverColumns } from './columns'
import { Caregiver } from '@/types/caregiver'

interface Props {
    caregivers: Caregiver[]
}

export function CaregiversWrapper({ caregivers }: Props) {
    const [selectedCaregivers, setSelectedCaregivers] = useState<Caregiver[]>([])
    const [isComposerOpen, setIsComposerOpen] = useState(false)

    function handleSendEmails(recipients: Caregiver[]) {
        setSelectedCaregivers(recipients)
        setIsComposerOpen(true)
    }

    return (
        <>
            <DataTable
                data={caregivers}
                columns={caregiverColumns}
                onSendEmails={handleSendEmails}
                groupingOptions={[
                    { value: 'active', label: 'Agrupar por estado' },
                ]}
                searchPlaceholder="Buscar por nombre, email..."
            />
            <EmailComposer
                isOpen={isComposerOpen}
                onClose={() => setIsComposerOpen(false)}
                recipients={selectedCaregivers}
            />
        </>
    )
}