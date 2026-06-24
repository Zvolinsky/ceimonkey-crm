'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'


export async function updateLeadState(id: number, state: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('leads')
        .update({ state })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/leads')
}

export async function convertLeadToCaregiver(
    leadId: number,
    data: {
        first_name: string
        last_name: string
        email: string
        phone: string | null
    }
) {
    //TODO: zrobić obsługę błędów
    //TODO: naprawić NULL telefon
    //TODO: zrobić formatowanie telefonu
    const supabase = await createClient()

    const { data: existing } = await supabase
        .from('caregivers')
        .select('id, first_name, last_name')
        .eq('email', data.email)
        .maybeSingle()

    if (existing) {
        throw new Error(
            `Ya existe un cuidador con este email: ${existing.first_name} ${existing.last_name}`
        )
    }

    const { data: newCaregiver, error: insertError } = await supabase
        .from('caregivers')
        .insert({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone ?? null,
            active: true,
        })
        .select('id')
        .single()

    if (insertError) throw new Error(insertError.message)

    const { error: updateError } = await supabase
        .from('leads')
        .update({ converted_to_caregiver_id: newCaregiver.id })
        .eq('id', leadId)

    if (updateError) throw new Error(updateError.message)

    revalidatePath('/dashboard/leads')
    revalidatePath('/dashboard/caregivers')
}