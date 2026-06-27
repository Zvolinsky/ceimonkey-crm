import { Column, ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export function SortableHeader<TData>(column: Column<TData, unknown>, label: string) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}

export function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
    return {
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
    }
}

export function createPersonalDataColumns<TData>(): ColumnDef<TData, unknown>[] {
    return [
        {
            accessorKey: 'first_name',
            header: ({ column }) => SortableHeader(column, "Nombre"),
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('first_name')}</span>
            ),
        },
        {
            accessorKey: 'last_name',
            header: ({ column }) => SortableHeader(column, "Apellido"),
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('last_name')}</span>
            ),
        },
        {
            accessorKey: 'email',
            header: ({ column }) => SortableHeader(column, "Email"),
            cell: ({ row }) => row.getValue('email') ?? '—',
        },
        {
            accessorKey: 'phone',
            header: 'Teléfono',
            cell: ({ row }) => row.getValue('phone') ?? '—',
            enableGrouping: false,
        },
    ]
}

export function createCreatedAtColumn<TData>(): ColumnDef<TData, unknown> {
    return {
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
    }
}