'use client'

import {useMemo, useState} from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    GroupingState,
    ColumnFiltersState,
    RowSelectionState,
} from '@tanstack/react-table'
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Mail, ChevronDown, ChevronRight } from 'lucide-react'
import {Checkbox} from "@/components/ui/checkbox";

function formatGroupValue(columnId: unknown, value: unknown): string {
    return value == null || value === 'null' || value === '' ? '(sin datos)' : String(value)
}

export interface GroupingOption {
    value: string
    label: string
}

interface DataTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData, unknown>[]
    onSendEmails?: (recipients: TData[]) => void
    groupingOptions?: GroupingOption[]
    searchPlaceholder?: string
    sendButtonLabel?: string
    arrayGroupingKeys?: string[]
}

export function DataTable<TData>({
                                     data,
                                     columns,
                                     onSendEmails,
                                     groupingOptions = [],
                                     searchPlaceholder = 'Buscar...',
                                     sendButtonLabel = 'Enviar correos',
                                     arrayGroupingKeys = []
                                 }: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [grouping, setGrouping] = useState<GroupingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const processedData = useMemo(() => {
        if (
            grouping.length === 0 ||
            !arrayGroupingKeys.includes(grouping[0])
        ) {
            return data
        }

        const key = grouping[0] as keyof TData
        const expanded: TData[] = []

        for (const row of data) {
            const value = row[key]
            if (Array.isArray(value) && value.length > 0) {
                for (const item of value) {
                    expanded.push({ ...row, [key]: item })
                }
            } else {
                expanded.push({ ...row, [key]: null })
            }
        }

        return expanded
    }, [data, grouping, arrayGroupingKeys])

    const table = useReactTable({
        data: processedData as TData[],
        columns,
        autoResetPageIndex: false,
        state: { sorting, grouping, columnFilters, globalFilter, rowSelection },
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

    const selectedRows = table.getSelectedRowModel().rows.map(r => r.original)
    const selectedCount = selectedRows.length

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="w-72"
                    />
                    {groupingOptions.length > 0 && (
                        <Select
                            value={grouping[0] ?? 'none'}
                            onValueChange={v => setGrouping(v === 'none' ? [] : [v])}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Agrupar por..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin agrupación</SelectItem>
                                {groupingOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Info zaznaczenia */}
                    {selectedCount > 0 && (
                        <p className="text-sm text-muted-foreground">
                            {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}.{' '}
                            <button
                                onClick={() => table.resetRowSelection()}
                                className="underline hover:no-underline"
                            >
                                Limpiar selección
                            </button>
                        </p>
                    )}
                </div>
                {onSendEmails && (
                    <Button
                        onClick={() => onSendEmails(selectedRows)}
                        disabled={selectedCount === 0}
                        className="gap-2"
                    >
                        <Mail className="h-4 w-4" />
                        {sendButtonLabel}
                        {selectedCount > 0 && (
                            <Badge variant="secondary" className="ml-1">{selectedCount}</Badge>
                        )}
                    </Button>
                )}
            </div>



            {/* Tabela */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(
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
                                            <TableCell colSpan={columns.length} className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    {row.getIsExpanded()
                                                        ? <ChevronDown className="h-4 w-4" />
                                                        : <ChevronRight className="h-4 w-4" />}
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
                                                    <Badge variant="outline">{row.subRows.length}</Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                return (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No hay registros.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <p className="text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} registro{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
                {globalFilter && ` (filtrado de ${data.length})`}
            </p>
        </div>
    )
}