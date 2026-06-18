export type Lead = {
    id: number
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    source: string | null
    state: string
    created_at: string
}