'use client'

import { useState, useEffect } from 'react'
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
} from '@dnd-kit/core'
import { toast } from 'sonner'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { Lead } from '@/types/lead'
import { updateLeadState } from '../actions'

export const KANBAN_STATES = [
    'Nueva consulta',
    'Contactado',
    'Visita programada',
    'Matriculado',
    'Descartado',
] as const

interface Props {
    leads: Lead[]
    onMatriculado: (lead: Lead) => void
}

export function KanbanView({ leads, onMatriculado }: Props) {
    const [localLeads, setLocalLeads] = useState(leads)
    const [activeLead, setActiveLead] = useState<Lead | null>(null)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalLeads(leads)
    }, [leads])

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 8 },
        })
    )

    function handleDragStart(event: DragStartEvent) {
        const lead = localLeads.find(l => l.id === Number(event.active.id))
        setActiveLead(lead ?? null)
    }

    async function handleDragEnd(event: DragEndEvent) {
        setActiveLead(null)

        const { active, over } = event
        if (!over) return

        const leadId = Number(active.id)
        const newState = String(over.id)
        const lead = localLeads.find(l => l.id === leadId)

        if (!lead || lead.state === newState) return

        const prevState = lead.state

        setLocalLeads(prev =>
            prev.map(l => l.id === leadId ? { ...l, state: newState } : l)
        )

        try {
            await updateLeadState(leadId, newState)

            if (newState === 'Matriculado') {
                onMatriculado({ ...lead, state: newState })
            }
        } catch {
            // Cofnij jeśli serwer zwrócił błąd
            setLocalLeads(prev =>
                prev.map(l => l.id === leadId ? { ...l, state: prevState } : l)
            )
            toast.error('Error al actualizar el estado')
        }
    }

    const leadsByState = KANBAN_STATES.reduce((acc, state) => {
        acc[state] = localLeads.filter(l => l.state === state)
        return acc
    }, {} as Record<string, Lead[]>)

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
                {KANBAN_STATES.map(state => (
                    <KanbanColumn
                        key={state}
                        state={state}
                        leads={leadsByState[state] ?? []}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeLead && (
                    <div className="rotate-2 scale-105">
                        <KanbanCard lead={activeLead} />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    )
}