import { createClient } from '@/lib/supabase/server'
import { LeadsWrapper } from './components/LeadsWrapper'

export default async function LeadsPage() {
    const supabase = await createClient()

    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) {
        return (
            <div className="p-8 text-red-500">
                Error al cargar los datos: {error.message}
            </div>
        )
    }
    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Leads</h1>
            </div>
            <LeadsWrapper leads={leads ?? []} />
        </div>
    )
}