'use client'

import { useState } from 'react'
import { DataTable } from './DataTable'
import { EmailComposer } from './EmailComposer'
import { Caregiver } from '../../../../types/caregiver'

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
                onSendEmails={handleSendEmails}
            />

            <EmailComposer
                isOpen={isComposerOpen}
                onClose={() => setIsComposerOpen(false)}
                recipients={selectedRecipients}
            />
        </>
    )
}