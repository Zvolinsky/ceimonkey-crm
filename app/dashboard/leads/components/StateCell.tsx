'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Loader2 } from 'lucide-react'
import { updateLeadState } from '../actions'
import { Lead } from '@/types/lead'
import { LEAD_STATE_STYLES } from "@/constants/styles";


const STATE_GROUPS = [
    ['Nueva consulta', 'Contactado', 'Visita programada'],
    ['Matriculado'],
    ['Descartado'],
]

interface Props {
    lead: Lead
    onStateChange?: (lead: Lead, newState: string) => void
}

export function StateCell({ lead, onStateChange }: Props) {
    const [isPending, startTransition] = useTransition()

    function handleSelect(newState: string) {
        if (newState === lead.state) return

        startTransition(async () => {
            try {
                await updateLeadState(lead.id, newState)
                onStateChange?.(lead, newState)
            } catch {
                toast.error('Error al actualizar el estado')
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isPending}>
                <button
                    className="flex items-center gap-1.5 group outline-none"
                    aria-label="Cambiar estado"
                >
                    <Badge className={LEAD_STATE_STYLES[lead.state] ?? ''}>
                        {lead.state}
                    </Badge>
                    {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-52">
                {STATE_GROUPS.map((group, groupIndex) => (
                    <span key={groupIndex}>
            {groupIndex > 0 && <DropdownMenuSeparator />}
                        {group.map(option => (
                            <DropdownMenuItem
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="gap-2 cursor-pointer"
                            >
                                <Badge className={`${LEAD_STATE_STYLES[option]} pointer-events-none`}>
                                    {option}
                                </Badge>
                                {option === lead.state && (
                                    <span className="ml-auto text-xs text-muted-foreground">
                    actual
                  </span>
                                )}
                            </DropdownMenuItem>
                        ))}
          </span>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}