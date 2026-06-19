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