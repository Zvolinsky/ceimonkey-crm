'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Caregiver } from '@/types/caregiver'
import { SERVICES_STYLES, AGE_GROUPS_STYLES} from "@/constants/styles";

export const caregiverColumns: ColumnDef<Caregiver, unknown>[] = [
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
    },
    {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => row.getValue('phone') ?? '—',
        enableGrouping: false,
    },
    {
        accessorKey: 'registration_status',
        header: 'Estado matrícula',
        cell: ({ row }) => {
            const status = row.getValue('registration_status') as string
            return (
                <Badge
                    className={
                        status === 'Matriculada'
                            ? 'bg-green-700 text-white hover:bg-green-900'
                            : 'bg-gray-500 text-white hover:bg-gray-700'
                    }
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'services',
        header: 'Servicios',
        cell: ({ row }) => {
            const raw = row.getValue('services')

            const services: string[] = Array.isArray(raw)
                ? raw
                : raw && typeof raw === 'string'
                    ? [raw]
                    : []

            if (!services.length) {
                return <span className="text-muted-foreground text-xs">—</span>
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {services.map(s => (
                        <Badge key={s} className={SERVICES_STYLES[s] ?? ''}>
                            {s}
                        </Badge>
                    ))}
                </div>
            )
        },
        enableGrouping: false,
        enableSorting: false,
    },
    {
        accessorKey: 'age_groups',
        header: 'Grupos de edad',
        cell: ({ row }) => {
            const raw = row.getValue('age_groups')

            const ageGroups: string[] = Array.isArray(raw)
                ? raw
                : raw && typeof raw === 'string'
                    ? [raw]
                    : []

            if (!ageGroups.length) {
                return <span className="text-muted-foreground text-xs">—</span>
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {ageGroups.map(s => (
                        <Badge key={s} className={AGE_GROUPS_STYLES[s] ?? ''}>
                            {s}
                        </Badge>
                    ))}
                </div>
            )
        },
        enableGrouping: false,
        enableSorting: false,
    },
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
            new Date(row.getValue('created_at')).toLocaleDateString('es-ES'),
        enableGrouping: false,
    },
]