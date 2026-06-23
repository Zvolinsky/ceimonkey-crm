import { createClient } from '@/lib/supabase/server'
import { CaregiversWrapper } from './components/CaregiversWrapper'

export default async function CaregiversPage() {
    const supabase = await createClient()

    const { data: caregivers, error } = await supabase
        .from('caregivers')
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
                <h1 className="text-2xl font-bold">Familias</h1>
            </div>
            <CaregiversWrapper caregivers={caregivers ?? []} />
        </div>
    )
}