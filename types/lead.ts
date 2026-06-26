export type CreateLead = {
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    source: 'Website' | 'Instagram' | 'Recomendación' | 'Pasó por la puerta' | 'Otro' | null
    state: 'Nueva consulta' | 'Contactado' | 'Visita programada' | 'Matriculado' | 'Descartado',
}

export type Lead = CreateLead & {
    id: number
    converted_to_caregiver_id: number | null
    created_at: string
}