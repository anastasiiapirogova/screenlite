import { ValidationError } from '@/shared/errors/validation.error.ts'

export class UserEmailState {
    private _email: string
    private _pendingEmail: string | null
    private _verifiedAt: Date | null
  
    constructor(email: string, pendingEmail: string | null, verifiedAt: Date | null) {
        this._email = email
        this._pendingEmail = pendingEmail
        this._verifiedAt = verifiedAt
    }
  
    get current(): string {
        return this._email
    }
  
    get pending(): string | null {
        return this._pendingEmail
    }
  
    get isVerified(): boolean {
        return !!this._verifiedAt
    }

    get verifiedAt(): Date | null {
        return this._verifiedAt
    }
  
    confirmPending(): void {
        if (!this._pendingEmail) {
            throw new ValidationError({ pendingEmail: ['NO_PENDING_EMAIL_FOUND'] })
        }
        this._email = this._pendingEmail
        this._pendingEmail = null
        this._verifiedAt = new Date()
    }
  
    setPending(email: string): void {
        if (!this.isEmailValid(email)) {
            throw new ValidationError({ email: ['INVALID_EMAIL'] })
        }
        if (this._email === email) {
            throw new ValidationError({
                email: ['PENDING_EMAIL_CANNOT_BE_THE_SAME_AS_THE_CURRENT_EMAIL'],
            })
        }
        this._pendingEmail = email
    }

    clearPending(): void {
        this._pendingEmail = null
    }
  
    private isEmailValid(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
  
    verify(): void {
        this._verifiedAt = new Date()
    }
}
  