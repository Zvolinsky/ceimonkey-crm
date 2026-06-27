'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Caregiver } from '@/types/caregiver'
import { SERVICES_STYLES, AGE_GROUPS_STYLES} from "@/constants/styles";
import {createCreatedAtColumn, createPersonalDataColumns, createSelectColumn} from "@/lib/table-helpers";

export const caregiverColumns: ColumnDef<Caregiver, unknown>[] = [
        createSelectColumn(),
    ...createPersonalDataColumns() as ColumnDef<Caregiver, unknown>[],
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
    createCreatedAtColumn()
]