'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { StateCell } from './StateCell'
import { Lead } from '@/types/lead'

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
                    onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label="Seleccionar fila"
                />
            ),
            enableSorting: false,
            enableGrouping: false,
        },
        {
            accessorKey: 'first_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('first_name')}</span>
            ),
        },
        {
            accessorKey: 'last_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Apellido
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('last_name')}</span>
            ),
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue('email') ?? '—',
            enableGrouping: false,
        },
        {
            accessorKey: 'phone',
            header: 'Teléfono',
            cell: ({ row }) => row.getValue('phone') ?? '—',
            enableGrouping: false,
        },
        {
            accessorKey: 'state',
            header: 'Estado',
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
                    Fecha de creación <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) =>
                new Date(row.getValue('created_at')).toLocaleDateString('es-ES'),
            enableGrouping: false,
        },
    ]
}