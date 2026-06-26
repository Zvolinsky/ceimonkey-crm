type Service = 'Piscinas' | 'Extraescolares' | 'Campus de verano'
type AgeGroup = 'Delfines' | 'Caracol' | 'Pollito' | 'Mariposa' | 'Tortuga' | 'Jirafa'

export type Caregiver = {
    id: number
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    registration_status: 'Matriculada' | 'No matriculada'
    services: Service[] | null
    age_groups: AgeGroup[] | null
    created_at: string
}