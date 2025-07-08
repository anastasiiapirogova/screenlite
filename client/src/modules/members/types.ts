export type Member = {
    userId: string
    user: {
        id: string
        name: string
        email: string
        profilePhoto: string | null
    }
}