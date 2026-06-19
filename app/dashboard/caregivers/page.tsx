import { createClient } from '@/lib/supabase/server'
import { EmailComposerWrapper } from './components/EmailComposerWrapper'
export default async function Home() {
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
    console.log('caregivers:', caregivers?.length, 'error:', error)
  return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Familias</h1>
        </div>
        <EmailComposerWrapper caregivers={caregivers ?? []} />
      </div>
  )
}