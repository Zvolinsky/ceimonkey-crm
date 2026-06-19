'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { StateCell } from './StateCell'   // ← nowy import
import { Lead } from '@/types/lead'

// Funkcja zamiast stałej — przyjmuje callback dla LeadsWrapper
export function createLeadColumns(
    onStateChange?: (lead: Lead, newState: string) => void
): ColumnDef<Lead, unknown>[] {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={v => row.toggleSelected(!!v)}
                    aria-label="Seleccionar fila"
                />
            ),
            enableSorting: false,
            enableGrouping: false,
        },
        {
            id: 'nombre',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            accessorFn: row => `${row.first_name} ${row.last_name}`,
            cell: ({ row }) => (
                <span className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </span>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) =>
                row.getValue('email') ?? (
                    <span className="text-muted-foreground">—</span>
                ),
            enableGrouping: false,
        },
        {
            accessorKey: 'phone',
            header: 'Teléfono',
            cell: ({ row }) =>
                row.getValue('phone') ?? (
                    <span className="text-muted-foreground">—</span>
                ),
            enableGrouping: false,
        },
        {
            accessorKey: 'state',
            header: 'Estado',
            // StateCell obsługuje i wyświetlanie i edycję
            cell: ({ row }) => (
                <StateCell
                    lead={row.original}
                    onStateChange={onStateChange}
                />
            ),
        },
        {
            accessorKey: 'source',
            header: 'Fuente',
            cell: ({ row }) =>
                row.getValue('source') ?? (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Fecha <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) =>
                new Date(row.getValue('created_at')).toLocaleDateString('es-ES'),
            enableGrouping: false,
        },
    ]
}