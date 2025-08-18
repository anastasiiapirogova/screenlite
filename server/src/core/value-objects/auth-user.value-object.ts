export class AuthUser {
    public readonly id: string
    public readonly email: string
    public readonly name: string
    public readonly hasAdminAccess: boolean
    public readonly isSuperAdmin: boolean
    public readonly isActive: boolean

    constructor({
        id,
        email,
        name,
        hasAdminAccess,
        isSuperAdmin,
        isActive,
    }: {
        id: string
        email: string
        name: string
        hasAdminAccess: boolean
        isSuperAdmin: boolean
        isActive: boolean
    }) {
        this.id = id
        this.email = email
        this.name = name
        this.hasAdminAccess = hasAdminAccess
        this.isSuperAdmin = isSuperAdmin
        this.isActive = isActive
    }
}