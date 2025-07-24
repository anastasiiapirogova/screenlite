import { PublicUserDTO } from '../dto/public-user.dto.ts'
import { UserDTO } from '../dto/user.dto.ts'
import { UserRole } from '../enums/user-role.enum.ts'
import { ValidationError } from '../errors/validation.error.ts'

export class User {
    public readonly id: string
    private _email: string
    private _pendingEmail: string | null = null
    public readonly name: string
    private _password: string
    private _role: UserRole
    private emailVerifiedAt: Date | null = null
    private _passwordUpdatedAt: Date | null = null
    private profilePhoto: string | null = null
    private _totpSecret: string | null = null
    private _twoFactorEnabled: boolean = false
    private deletionRequestedAt: Date | null = null
    private deletedAt: Date | null = null

    constructor(dto: UserDTO) {
        this.id = dto.id
        this._email = dto.email
        this._pendingEmail = dto.pendingEmail
        this.name = dto.name
        this._password = dto.password
        this._role = dto.role
        this.emailVerifiedAt = dto.emailVerifiedAt
        this._passwordUpdatedAt = dto.passwordUpdatedAt
        this.profilePhoto = dto.profilePhoto
        this._totpSecret = dto.totpSecret
        this._twoFactorEnabled = dto.twoFactorEnabled
        this.deletionRequestedAt = dto.deletionRequestedAt
        this.deletedAt = dto.deletedAt
    }

    get isActive(): boolean {
        return !this.deletionRequestedAt && !this.deletedAt
    }

    get email(): string {
        return this._email
    }

    get isAdmin(): boolean {
        return this._role === UserRole.ADMIN
    }

    get isSuperAdmin(): boolean {
        return this._role === UserRole.SUPER_ADMIN
    }

    get pendingEmail(): string | null {
        return this._pendingEmail
    }

    set role(role: UserRole) {
        this._role = role
    }

    confirmPendingEmail(): void {
        if(!this._pendingEmail) {
            throw new ValidationError({
                pendingEmail: ['NO_PENDING_EMAIL_FOUND'],
            })
        }

        this._email = this._pendingEmail

        this.verifyEmail()
        this.clearPendingEmail()
    }

    setPendingEmail(email: string): void {
        if(!this.isEmailValid(email)) {
            throw new ValidationError({
                email: ['INVALID_EMAIL'],
            })
        }

        if(this._email === email) {
            throw new ValidationError({
                email: ['PENDING_EMAIL_CANNOT_BE_THE_SAME_AS_THE_CURRENT_EMAIL'],
            })
        }

        this._pendingEmail = email
    }

    clearPendingEmail(): void {
        this._pendingEmail = null
    }

    verifyEmail(): void {
        this.emailVerifiedAt = new Date()
    }
  
    updatePassword(newHashedPassword: string): void {
        this._password = newHashedPassword
        this._passwordUpdatedAt = new Date()
    }

    updateTwoFactorSecret(secret: string): void {
        this._totpSecret = secret
    }
  
    enableTwoFactorAuth(): void {
        if(!this._totpSecret) {
            throw new ValidationError({
                totpSecret: ['NO_TOTP_SECRET_FOUND'],
            })
        }

        this._twoFactorEnabled = true
    }
  
    disableTwoFactorAuth(): void {
        this._twoFactorEnabled = false
        this._totpSecret = null
    }
  
    requestDeletion(): void {
        this.deletionRequestedAt = new Date()
    }

    get isDeletionRequested(): boolean {
        return !!this.deletionRequestedAt
    }

    cancelDeletionRequest(): void {
        this.deletionRequestedAt = null
    }
  
    get isDeleted(): boolean {
        return !!this.deletedAt
    }
  
    get password(): string {
        return this._password
    }
  
    get passwordUpdatedAt(): Date | null {
        return this._passwordUpdatedAt
    }
  
    get totpSecret(): string | null {
        return this._totpSecret
    }
  
    get twoFactorEnabled(): boolean {
        return this._twoFactorEnabled
    }

    private isEmailValid(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    toDTO(): UserDTO {
        return {
            id: this.id,
            email: this._email,
            pendingEmail: this._pendingEmail,
            name: this.name,
            password: this._password,
            emailVerifiedAt: this.emailVerifiedAt,
            passwordUpdatedAt: this._passwordUpdatedAt,
            profilePhoto: this.profilePhoto,
            totpSecret: this._totpSecret,
            twoFactorEnabled: this._twoFactorEnabled,
            deletionRequestedAt: this.deletionRequestedAt,
            deletedAt: this.deletedAt,
            role: this._role,
        }
    }

    toPublicDTO(): PublicUserDTO {
        return {
            id: this.id,
            email: this._email,
            pendingEmail: this._pendingEmail,
            name: this.name,
            role: this._role,
            emailVerifiedAt: this.emailVerifiedAt,
            passwordUpdatedAt: this._passwordUpdatedAt,
            profilePhoto: this.profilePhoto,
            twoFactorEnabled: this._twoFactorEnabled,
            deletionRequestedAt: this.deletionRequestedAt,
            deletedAt: this.deletedAt,
        }
    }
}