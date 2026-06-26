'use client'

import { useEffect, useTransition } from 'react'
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
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Loader2, UserPlus } from 'lucide-react'
import { Lead } from '@/types/lead'
import { convertLeadToCaregiver } from '../actions'

const schema = z.object({
    first_name: z.string().min(2, 'Mínimo 2 caracteres'),
    last_name:  z.string().min(2, 'Mínimo 2 caracteres'),
    email:      z.string().email('Email inválido'),
    phone:      z.string().nullable().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
    lead: Lead | null
    onClose: () => void
}

export function ConversionModal({ lead, onClose }: Props) {
    const [isPending, startTransition] = useTransition()

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    // Wypełnij formularz danymi leada gdy się otworzy
    useEffect(() => {
        if (lead) {
            reset({
                first_name: lead.first_name,
                last_name:  lead.last_name,
                email:      lead.email ?? '',
                phone:      lead.phone ?? '',
            })
        }
    }, [lead, reset])

    function handleClose() {
        if (isPending) return
        onClose()
    }

    function onSubmit(values: FormValues) {
        if (!lead) return

        startTransition(async () => {
            try {
                await convertLeadToCaregiver(lead.id, {
                    first_name: values.first_name,
                    last_name:  values.last_name,
                    email:      values.email,
                    phone:      values.phone ?? null,
                })
                toast.success(
                    `${values.first_name} ${values.last_name} añadido/a como cuidador/a`
                )
                onClose()
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Error al convertir el lead')
            }
        })
    }

    return (
        <Dialog open={!!lead} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Convertir lead en cuidador/a
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                Lead
                            </Badge>
                            <ArrowRight className="h-3.5 w-3.5" />
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                Cuidador/a
                            </Badge>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Revisa y completa los datos antes de crear el registro.
                        {!lead?.email && (
                            <span className="block mt-1 text-amber-600 font-medium">
                ⚠️ Este lead no tiene email — es obligatorio para cuidadores.
              </span>
                        )}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="conv-first-name">Nombre</Label>
                            <Input
                                id="conv-first-name"
                                {...register('first_name')}
                                aria-invalid={!!errors.first_name}
                            />
                            {errors.first_name && (
                                <p className="text-xs text-red-500">{errors.first_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="conv-last-name">Apellidos</Label>
                            <Input
                                id="conv-last-name"
                                {...register('last_name')}
                                aria-invalid={!!errors.last_name}
                            />
                            {errors.last_name && (
                                <p className="text-xs text-red-500">{errors.last_name.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="conv-email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="conv-email"
                            type="email"
                            {...register('email')}
                            aria-invalid={!!errors.email}
                            autoFocus={!lead?.email}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="conv-phone">Teléfono</Label>
                        <Input
                            id="conv-phone"
                            {...register('phone')}
                        />
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
                                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creando...</>
                                : <><UserPlus className="h-4 w-4" /> Crear cuidador/a</>
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}