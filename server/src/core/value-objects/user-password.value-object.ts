import { ValidationError } from '@/shared/errors/validation.error.ts'

export class UserPassword {
    private readonly value: string

    constructor(plain: string) {
        const MIN_LENGTH = 8
        const MAX_LENGTH = 256

        if (plain.length < MIN_LENGTH) {
            throw new ValidationError({
                password: ['PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS']
            })
        }

        if (plain.length > MAX_LENGTH) {
            throw new ValidationError({
                password: ['PASSWORD_MUST_BE_LESS_THAN_256_CHARACTERS']
            })
        }

        this.value = plain
    }

    toString() {
        return this.value
    }
}