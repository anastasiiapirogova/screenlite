import { UserDTO } from '../dto/user.dto.ts'

export class User {
    public readonly id: string
    public readonly email: string
    public readonly name: string
    private _password: string
    private emailVerifiedAt: Date | null = null
    private _passwordUpdatedAt: Date | null = null
    private profilePhoto: string | null = null
    private _totpSecret: string | null = null
    private _twoFactorEnabled: boolean = false
    private deletedAt: Date | null = null

    constructor(dto: UserDTO) {
        this.id = dto.id    
        this.email = dto.email
        this.name = dto.name
        this._password = dto.password
        this.emailVerifiedAt = dto.emailVerifiedAt
        this._passwordUpdatedAt = dto.passwordUpdatedAt
        this.profilePhoto = dto.profilePhoto
        this._totpSecret = dto.totpSecret
        this._twoFactorEnabled = dto.twoFactorEnabled
        this.deletedAt = dto.deletedAt
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
            throw new Error('No TOTP secret found')
        }

        this._twoFactorEnabled = true
    }
  
    disableTwoFactorAuth(): void {
        this._twoFactorEnabled = false
        this._totpSecret = null
    }
  
    softDelete(): void {
        this.deletedAt = new Date()
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

    toDTO(): UserDTO {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            password: this._password,
            emailVerifiedAt: this.emailVerifiedAt,
            passwordUpdatedAt: this._passwordUpdatedAt,
            profilePhoto: this.profilePhoto,
            totpSecret: this._totpSecret,
            twoFactorEnabled: this._twoFactorEnabled,
            deletedAt: this.deletedAt,
        }
    }
}