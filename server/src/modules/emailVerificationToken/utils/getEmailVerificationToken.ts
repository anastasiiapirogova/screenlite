import crypto from 'crypto'

export const getEmailVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex')
}