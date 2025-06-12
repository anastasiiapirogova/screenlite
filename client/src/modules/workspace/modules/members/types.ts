export type Member = {
    user: {
        id: string
        name: string
        email: string
        profilePhoto: string | null
        createdAt: string
        deletedAt: string | null
    }
}