'use client'

import { useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, UserPlus } from 'lucide-react'
import { SERVICES_OPTIONS, AGE_GROUPS_OPTIONS, REGISTRATION_STATUS_OPTIONS} from "@/constants/options";
import { createCaregiver } from '../actions'
import { caregiverSchema as schema } from "@/constants/schemas";

type FormValues = z.infer<typeof schema>

interface Props {
    isOpen: boolean
    onClose: () => void
}

export function CreateCaregiverModal({ isOpen, onClose }: Props) {
    const [isPending, startTransition] = useTransition()

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            registration_status: 'Matriculada',
            services: [],
            age_groups: [],
        },
    })

    const selectedServices = watch(['services', 'age_groups'])

    function toggleArrayField(fieldName: 'services' | 'age_groups', value: string) {
        const current = watch(fieldName) ?? []
        setValue(
            fieldName,
            current.includes(value)
                ? current.filter(s => s !== value)
                : [...current, value]
        )
    }

    function handleClose() {
        if (isPending) return
        reset()
        onClose()
    }

    function onSubmit(values: FormValues) {
        startTransition(async () => {
            try {
                await createCaregiver({
                    first_name: values.first_name,
                    last_name:  values.last_name,
                    email:      values.email,
                    phone:      values.phone || null,
                    registration_status:     values.registration_status,
                    services:        values.services,
                    age_groups: values.age_groups,
                })
                toast.success(`Cuidador/a ${values.first_name} ${values.last_name} creado/a`)
                handleClose()
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Error al crear el cuidador')
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Nuevo cuidador/a
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="cg-first-name">Nombre</Label>
                            <Input
                                id="cg-first-name"
                                {...register('first_name')}
                                aria-invalid={!!errors.first_name}
                            />
                            {errors.first_name && (
                                <p className="text-xs text-red-500">{errors.first_name.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cg-last-name">Apellidos</Label>
                            <Input
                                id="cg-last-name"
                                {...register('last_name')}
                                aria-invalid={!!errors.last_name}
                            />
                            {errors.last_name && (
                                <p className="text-xs text-red-500">{errors.last_name.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="cg-email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cg-email"
                            type="email"
                            {...register('email')}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="cg-phone">Teléfono</Label>
                            <Input id="cg-phone" {...register('phone')} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Estado matrícula</Label>
                        <Controller
                            control={control}
                            name="registration_status"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGISTRATION_STATUS_OPTIONS.map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Servicios</Label>
                        <div className="rounded-lg border p-3 space-y-2">
                            {SERVICES_OPTIONS.map(service => (
                                <div key={service} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`serv-${service}`}
                                        checked={selectedServices[0]?.includes(service) ?? false}
                                        onCheckedChange={() => toggleArrayField('services', service)}
                                    />
                                    <label
                                        htmlFor={`serv-${service}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {service}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Grupos de edad</Label>
                        <div className="rounded-lg border p-3 space-y-2">
                            {AGE_GROUPS_OPTIONS.map(ageGroup => (
                                <div key={ageGroup} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`serv-${ageGroup}`}
                                        checked={selectedServices[1]?.includes(ageGroup) ?? false}
                                        onCheckedChange={() => toggleArrayField('age_groups', ageGroup)}
                                    />
                                    <label
                                        htmlFor={`serv-${ageGroup}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {ageGroup}
                                    </label>
                                </div>
                            ))}
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
                                : <><UserPlus className="h-4 w-4" /> Crear cuidador/a</>
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}