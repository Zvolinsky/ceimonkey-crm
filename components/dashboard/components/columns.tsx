'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Caregiver } from '../../../types/caregiver'

export const columns: ColumnDef<Caregiver>[] = [
    // --- Checkbox (multi-select) ---
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Zaznacz wszystkie"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Zaznacz wiersz"
            />
        ),
        enableSorting: false,
        enableGrouping: false,
    },

    // --- First name ---
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

    // --- Second name ---
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

    // --- Email ---
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
    },

    // --- Phone number ---
    {
        accessorKey: 'phone',
        header: 'Telefono',
        cell: ({ row }) => row.getValue('phone') ?? '—',
        enableGrouping: false,
    },

    // --- Status ---
    {
        accessorKey: 'active',
        header: 'Estado',
        cell: ({ row }) => {
            const active = row.getValue('active') as string
            return (
                <Badge variant={active ? 'default' : 'secondary'}>
                    {active ? 'Matriculadas' : 'No matriculadas'}
                </Badge>
            )
        },
    },

    // --- Data dodania ---
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Fecha de creación
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) =>
            new Date(row.getValue('created_at')).toLocaleDateString('pl-PL'),
        enableGrouping: false,
    },
]