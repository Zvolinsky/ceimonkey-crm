export type Lead = {
    id: number
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    source: string | null
    state: string
    converted_to_caregiver_id: number | null
    created_at: string
}