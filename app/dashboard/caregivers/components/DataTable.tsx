'use client'

import { useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    flexRender,
    SortingState,
    GroupingState,
    ColumnFiltersState,
    RowSelectionState,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, ChevronDown, ChevronRight } from 'lucide-react'
import { columns } from './columns'
import { Caregiver } from '../../../../types/caregiver'

function formatGroupValue(columnId: unknown, value: unknown): string {
    if (columnId === 'active') {
        const isActive =
            value === true ||
            value === 'true' ||
            value === 1 ||
            value === '1'
        return isActive ? 'Matriculadas' : 'No matriculadas'
    }
    return value == null || value === '' ? '(brak)' : String(value)
}

interface DataTableProps {
    data: Caregiver[]
    onSendEmails: (recipients: Caregiver[]) => void
}

export function DataTable({ data, onSendEmails }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [grouping, setGrouping] = useState<GroupingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const table = useReactTable({
        data,
        columns,
        autoResetPageIndex: false,
        state: {
            sorting,
            grouping,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    const selectedRecords = table
        .getSelectedRowModel()
        .rows.map(row => row.original)

    const selectedCount = selectedRecords.length

    return (
        <div className="space-y-4">
            {/* --- Toolbar --- */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Wyszukiwarka globalna */}
                    <Input
                        placeholder="Buscar por nombre, correo electrónico..."
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="w-72"
                    />

                    {/* Grupowanie */}
                    <Select
                        value={grouping[0] ?? 'none'}
                        onValueChange={value =>
                            setGrouping(value === 'none' ? [] : [value])
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Agrupar por..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin agrupar</SelectItem>
                            <SelectItem value="active">Agrupar por estado</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* --- Info o zaznaczeniu --- */}
                    {selectedCount > 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Se ha seleccionado {selectedCount} registro{selectedCount > 1 && 's'}.{' '}
                            <button
                                onClick={() => table.resetRowSelection()}
                                className="underline hover:no-underline"
                            >
                                Desmarcar
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">{" "}  </p>
                    )}
                </div>

                {/* Przycisk wysyłki — aktywny tylko gdy coś zaznaczone */}
                <Button
                    onClick={() => onSendEmails(selectedRecords)}
                    disabled={selectedCount === 0}
                    className="gap-2"
                >
                    <Mail className="h-4 w-4" />
                    Enviar
                    {selectedCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                            {selectedCount}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* --- Tabela --- */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => {
                                // Wiersz grupujący
                                if (row.getIsGrouped()) {
                                    const allSelected =
                                        row.subRows.length > 0 &&
                                        row.subRows.every(r => r.getIsSelected())
                                    const someSelected =
                                        !allSelected &&
                                        row.subRows.some(r => r.getIsSelected())
                                    const groupChecked: boolean | 'indeterminate' =
                                        allSelected
                                            ? true
                                            : someSelected
                                                ? 'indeterminate'
                                                : false

                                    return (
                                        <TableRow
                                            key={row.id}
                                            className="bg-muted/50 hover:bg-muted cursor-pointer"
                                            onClick={row.getToggleExpandedHandler()}
                                        >
                                            <TableCell
                                                colSpan={columns.length}
                                                className="font-semibold"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {row.getIsExpanded() ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                    <Checkbox
                                                        checked={groupChecked}
                                                        onClick={e => e.stopPropagation()}
                                                        onCheckedChange={value => {
                                                            const next = value === true
                                                            row.subRows.forEach(r =>
                                                                r.toggleSelected(next)
                                                            )
                                                        }}
                                                        aria-label={`Zaznacz grupę ${formatGroupValue(
                                                            row.groupingColumnId,
                                                            row.groupingValue
                                                        )}`}
                                                    />
                                                    {formatGroupValue(row.groupingColumnId, row.groupingValue)}{' '}
                                                    <Badge variant="outline">
                                                        {row.subRows.length}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                // Zwykły wiersz
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No hay registros.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- Footer z licznikiem --- */}
            <p className="text-sm text-muted-foreground">
                Un total de {table.getFilteredRowModel().rows.length} registros
                {globalFilter && ` (filtrowane z ${data.length})`}
            </p>
        </div>
    )
}