'use client'

import { useDroppable } from '@dnd-kit/core'
import { Badge } from '@/components/ui/badge'
import { KanbanCard } from './KanbanCard'
import { STATE_STYLES} from "@/app/dashboard/leads/components/StateCell";
import { Lead } from '@/types/lead'
import { cn } from '@/lib/utils'

interface Props {
    state: string
    leads: Lead[]
}

export function KanbanColumn({ state, leads }: Props) {
    const { setNodeRef, isOver } = useDroppable({ id: state })

    return (
        <div className="flex flex-col min-w-[240px] w-[240px]">
            <div className="flex items-center justify-between mb-3 px-1">
                <Badge className={STATE_STYLES[state] ?? ''}>{state}</Badge>
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {leads.length}
        </span>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    'flex flex-col gap-2 min-h-[200px] flex-1',
                    'rounded-xl p-2 transition-colors duration-150',
                    isOver ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-muted/30'
                )}
            >
                {leads.map(lead => (
                    <KanbanCard key={lead.id} lead={lead} />
                ))}

                {leads.length === 0 && (
                    <div className={cn(
                        'flex-1 flex items-center justify-center',
                        'text-xs text-muted-foreground/50 rounded-lg',
                        'border-2 border-dashed border-muted-foreground/20 min-h-[80px]',
                        isOver && 'border-primary/40 text-primary/50'
                    )}>
                        Soltar aquí
                    </div>
                )}
            </div>
        </div>
    )
}