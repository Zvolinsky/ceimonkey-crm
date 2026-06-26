'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, UserPlus } from 'lucide-react'
import { createLead } from '../actions'
import {LEAD_STATES, SOURCE_OPTIONS} from "@/constants/options";
import {Lead} from "@/types/lead";
import { leadSchema as schema } from "@/constants/schemas";

type FormValues = z.infer<typeof schema>

interface Props {
    isOpen: boolean
    onClose: () => void
}

export function CreateLeadModal({ isOpen, onClose }: Props) {
    const [isPending, startTransition] = useTransition()

    const {register, handleSubmit, reset, setValue, watch, formState: { errors },} = useForm<FormValues>({resolver: zodResolver(schema), defaultValues: { state: 'Nueva consulta' },})

    function handleClose() {
        if (isPending) return
        reset()
        onClose()
    }

    function onSubmit(values: FormValues) {
        startTransition(async () => {
            try {
                await createLead({
                    first_name: values.first_name,
                    last_name:  values.last_name,
                    email:      values.email  || null,
                    phone:      values.phone  || null,
                    source:     values.source || null,
                    state:      values.state,
                } as Lead)
                toast.success(`Lead ${values.first_name} ${values.last_name} creado`)
                handleClose()
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Error al crear el lead')
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Nuevo lead
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="lead-first-name">Nombre</Label>
                            <Input
                                id="lead-first-name"
                                {...register('first_name')}
                                aria-invalid={!!errors.first_name}
                            />
                            {errors.first_name && (
                                <p className="text-xs text-red-500">{errors.first_name.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="lead-last-name">Apellidos</Label>
                            <Input
                                id="lead-last-name"
                                {...register('last_name')}
                                aria-invalid={!!errors.last_name}
                            />
                            {errors.last_name && (
                                <p className="text-xs text-red-500">{errors.last_name.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="lead-email">
                            Email{' '}
                            <span className="text-muted-foreground text-xs">(o teléfono)</span>
                        </Label>
                        <Input
                            id="lead-email"
                            type="email"
                            {...register('email')}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Telefon */}
                    <div className="space-y-1.5">
                        <Label htmlFor="lead-phone">
                            Teléfono{' '}
                            <span className="text-muted-foreground text-xs">(o email)</span>
                        </Label>
                        <Input
                            id="lead-phone"
                            {...register('phone')}
                            aria-invalid={!!errors.phone}
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Fuente + Estado — obok siebie */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Fuente</Label>
                            <Select
                                value={watch('source') ?? ''}
                                onValueChange={v => setValue('source', v)}
                            >
                                <SelectTrigger aria-invalid={!!errors.source}>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SOURCE_OPTIONS.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Estado</Label>
                            <Select
                                value={watch('state')}
                                onValueChange={v => setValue('state', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LEAD_STATES.map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="gap-2">
                            {isPending
                                ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                                : <><UserPlus className="h-4 w-4" /> Crear lead</>
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}