'use client'

import { useState } from 'react'
import { DataTable } from '@/components/dashboard/DataTable'
import { EmailComposer } from '@/components/dashboard/EmailComposer'
import { caregiverColumns } from './columns'
import { Caregiver } from '@/types/caregiver'
import {useEmailComposer} from "@/hooks/useEmailComposer";

interface Props {
    caregivers: Caregiver[]
}

export function CaregiversWrapper({ caregivers }: Props) {
    const { selectedRecipients, isComposerOpen, openComposer, closeComposer } = useEmailComposer();

    return (
        <>
            <DataTable
                data={caregivers}
                columns={caregiverColumns}
                onSendEmails={openComposer}
                groupingOptions={[
                    { value: 'active', label: 'Agrupar por estado' },
                ]}
                searchPlaceholder="Buscar por nombre, email..."
            />
            <EmailComposer
                isOpen={isComposerOpen}
                onClose={closeComposer}
                recipients={selectedRecipients}
            />
        </>
    )
}