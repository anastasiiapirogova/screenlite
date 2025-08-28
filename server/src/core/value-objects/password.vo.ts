import { ValidationError } from '@/shared/errors/validation.error.ts'
import { USER_PASSWORD_RULES } from '@/shared/validation/user-password.rules.ts'

export class Password {
    private readonly value: string

    constructor(plain: string) {
        if (plain.length < USER_PASSWORD_RULES.minLength) {
            throw new ValidationError({
                password: ['PASSWORD_TOO_SHORT']
            })
        }

        if (plain.length > USER_PASSWORD_RULES.maxLength) {
            throw new ValidationError({
                password: ['PASSWORD_TOO_LONG']
            })
        }

        this.value = plain
    }

    toString() {
        return this.value
    }
}