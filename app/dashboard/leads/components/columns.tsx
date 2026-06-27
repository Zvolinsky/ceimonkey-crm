'use client'

import { ColumnDef } from '@tanstack/react-table'
import { StateCell } from './StateCell'
import { Lead } from '@/types/lead'
import {createPersonalDataColumns, createSelectColumn, createCreatedAtColumn} from "@/lib/table-helpers";

export function createLeadColumns(
    onStateChange?: (lead: Lead, newState: string) => void
): ColumnDef<Lead, unknown>[] {
    return [
            createSelectColumn(),
        ...createPersonalDataColumns() as ColumnDef<Lead, unknown>[],
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
            cell: ({ row }) => row.getValue('source') ?? '—',
        },
        createCreatedAtColumn()
    ]
}