'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCaregiver(data: {
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    registration_status: string
    services: string[] | null
    age_groups: string[] | null
}) {
    const supabase = await createClient()

    const { data: existing } = await supabase
        .from('caregivers')
        .select('id')
        .eq('email', data.email)
        .maybeSingle()

    if (existing) {
        throw new Error('Ya existe un cuidador con este email')
    }

    const { error } = await supabase.from('caregivers').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/caregivers')
}