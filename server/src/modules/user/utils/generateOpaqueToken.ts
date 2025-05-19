import crypto from 'crypto'

export const generateOpaqueToken = (): string => {
    return crypto.randomBytes(32).toString('hex')
}