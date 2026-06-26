'use client'

import { useState, useMemo, useCallback } from 'react'
import { DataTable } from '@/components/dashboard/DataTable'
import { EmailComposer } from '@/components/dashboard/EmailComposer'
import {KanbanView} from "@/app/dashboard/leads/components/KanbanView";
import { createLeadColumns } from './columns'
import { Lead } from '@/types/lead'
import {useEmailComposer} from "@/hooks/useEmailComposer";
import {ConversionModal} from "@/app/dashboard/leads/components/ConversionModal";
import {Button} from "@/components/ui/button";
import {LayoutGrid, List} from "lucide-react";
import { CreateLeadModal } from './CreateLeadModal'
import { Plus } from 'lucide-react'

type ViewMode = 'table' | 'kanban'

interface Props {
    leads: Lead[]
}

export function LeadsWrapper({ leads }: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>('table')
    const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const { selectedRecipients, isComposerOpen, openComposer, closeComposer } = useEmailComposer<Lead>();


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
            <div className="flex items-center justify-between">
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    size="sm"
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo lead
                </Button>

                <div className="flex items-center gap-1">
                    <Button
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        aria-label="Vista de tabla"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('kanban')}
                        aria-label="Vista kanban"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {viewMode === 'table' ? (
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
            ) : (
                <KanbanView
                    leads={leads}
                    onMatriculado={setLeadToConvert}
                />
            )}
            <EmailComposer
                isOpen={isComposerOpen}
                onClose={closeComposer}
                recipients={selectedRecipients}
            />
            <ConversionModal
                lead={leadToConvert}
                onClose={() => setLeadToConvert(null)}
            />
            <CreateLeadModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </>
    )
}