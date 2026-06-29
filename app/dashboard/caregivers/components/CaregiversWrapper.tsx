'use client'

import { useState } from 'react'
import { DataTable } from '@/components/dashboard/DataTable'
import { EmailComposer } from '@/components/dashboard/EmailComposer'
import { caregiverColumns } from './columns'
import { Caregiver } from '@/types/caregiver'
import {useEmailComposer} from "@/hooks/useEmailComposer";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {CreateCaregiverModal} from "./CreateCaregiverModal";

const groupingOptions = [
    { value: 'registration_status', label: 'Agrupar por estado' },
    { value: 'services', label: 'Agrupar por servicios' },
    { value: 'age_groups', label: 'Agrupar por grupos de edad' },
]

export function CaregiversWrapper({ caregivers }: { caregivers: Caregiver[]}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const { selectedRecipients, isComposerOpen, openComposer, closeComposer, copyEmails } = useEmailComposer();

    return (
        <>
            <div className="flex items-center justify-between">
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    size="sm"
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo cuidador/a
                </Button>
            </div>
            <DataTable
                data={caregivers}
                columns={caregiverColumns}
                onSendEmails={openComposer}
                onCopyEmails={copyEmails}
                arrayGroupingKeys={['services', 'age_groups']}
                groupingOptions={groupingOptions}
                searchPlaceholder="Buscar por nombre, email..."
            />
            <EmailComposer
                isOpen={isComposerOpen}
                onClose={closeComposer}
                recipients={selectedRecipients}
            />
            <CreateCaregiverModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </>
    )
}