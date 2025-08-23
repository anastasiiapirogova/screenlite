import { UserDTO } from '@/shared/dto/user.dto.ts'
import { UserRole } from '../enums/user-role.enum.ts'
import { UserEmailState } from '../value-objects/user-email-state.value-object.ts'
import { UserDeletionState } from '../value-objects/user-deletion-state.value-object.ts'

export class User {
    public readonly id: string
    public email: UserEmailState
    public readonly name: string
    public role: UserRole
    public profilePhotoPath: string | null
    public deletionState: UserDeletionState
    public readonly version: number

    constructor(dto: UserDTO) {
        this.id = dto.id
        this.email = new UserEmailState(dto.email, dto.pendingEmail, dto.emailVerifiedAt)
        this.name = dto.name
        this.role = dto.role
        this.profilePhotoPath = dto.profilePhotoPath
        this.deletionState = new UserDeletionState(dto.deletionRequestedAt, dto.deletedAt)
        this.version = dto.version
    }

    get isAdmin(): boolean {
        return this.role === UserRole.ADMIN
    }

    get isSuperAdmin(): boolean {
        return this.role === UserRole.SUPER_ADMIN
    }

    get hasAdminAccess(): boolean {
        return this.isAdmin || this.isSuperAdmin
    }
}