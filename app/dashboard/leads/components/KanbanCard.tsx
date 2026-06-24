'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Mail, Phone } from 'lucide-react'
import { Lead } from '@/types/lead'
import { cn } from '@/lib/utils'

interface Props {
    lead: Lead
}

export function KanbanCard({ lead }: Props) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: lead.id,
        data: { lead },
    })

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Translate.toString(transform) }}
            {...listeners}
            {...attributes}
            className={cn(
                'bg-card border rounded-lg p-3 shadow-sm space-y-2',
                'cursor-grab active:cursor-grabbing select-none',
                'transition-shadow hover:shadow-md',
                isDragging && 'opacity-50 shadow-lg ring-2 ring-primary/20'
            )}
        >
            <p className="font-medium text-sm">
                {lead.first_name} {lead.last_name}
            </p>
            {lead.email && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{lead.email}</span>
                </p>
            )}
            {lead.phone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3 w-3 shrink-0" />
                    {lead.phone}
                </p>
            )}
            {lead.source && (
                <p className="text-xs text-muted-foreground/70 truncate">
                    {lead.source}
                </p>
            )}
        </div>
    )
}