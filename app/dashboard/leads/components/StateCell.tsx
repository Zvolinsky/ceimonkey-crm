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

export const STATE_STYLES: Record<string, string> = {
    'Nueva consulta':    'bg-blue-100 text-blue-800 hover:bg-blue-100',
    'Contactado':        'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    'Visita programada': 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    'Matriculado':       'bg-green-100 text-green-800 hover:bg-green-100',
    'Descartado':        'bg-gray-100 text-gray-500 hover:bg-gray-100',
}

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
                    <Badge className={STATE_STYLES[lead.state] ?? ''}>
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
                                <Badge className={`${STATE_STYLES[option]} pointer-events-none`}>
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