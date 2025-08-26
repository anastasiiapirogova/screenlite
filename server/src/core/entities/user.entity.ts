import { UserDTO } from '@/shared/dto/user.dto.ts'
import { UserRole } from '../enums/user-role.enum.ts'
import { UserEmailState } from '../value-objects/user-email-state.value-object.ts'
import { UserDeletionState } from '../value-objects/user-deletion-state.value-object.ts'

export class User {
    public readonly id: string
    public email: UserEmailState
    private _name: string
    public role: UserRole
    private _profilePhotoPath: string | null
    public deletionState: UserDeletionState
    public readonly version: number

    constructor(dto: UserDTO) {
        this.id = dto.id
        this.email = new UserEmailState(dto.email, dto.pendingEmail, dto.emailVerifiedAt)
        this._name = dto.name
        this.role = dto.role
        this._profilePhotoPath = dto.profilePhotoPath
        this.deletionState = new UserDeletionState(dto.deletionRequestedAt, dto.deletedAt)
        this.version = dto.version
    }

    get name(): string {
        return this._name
    }

    get profilePhotoPath(): string | null {
        return this._profilePhotoPath
    }

    updateProfilePhotoPath(profilePhotoPath: string) {
        const prevProfilePhotoPath = this._profilePhotoPath

        this._profilePhotoPath = profilePhotoPath

        return prevProfilePhotoPath
    }

    removeProfilePhoto() {
        const prevProfilePhotoPath = this._profilePhotoPath

        this._profilePhotoPath = null

        return prevProfilePhotoPath
    }

    set name(name: string) {
        // The longest personal name is 747 characters long
        if(name.length < 1 || name.length > 1000) {
            throw new Error('INVALID_NAME_LENGTH')
        }

        this._name = name
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