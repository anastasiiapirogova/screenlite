import crypto from 'crypto'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'

export class NodeEncryptionService implements IEncryptionService {
    private readonly key: Buffer
    private readonly algorithm: string

    constructor(secretBase64: string, algorithm: string = 'aes-256-cbc') {
        this.validateSecret(secretBase64)

        this.key = Buffer.from(secretBase64, 'base64')
        this.algorithm = algorithm
    }

    public encrypt(plainText: string): string {
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)

        const encrypted = Buffer.concat([
            cipher.update(plainText, 'utf8'),
            cipher.final(),
        ])

        const combined = Buffer.concat([iv, encrypted])

        return combined.toString('base64')
    }

    public decrypt(encryptedText: string): string {
        const encryptedBuffer = Buffer.from(encryptedText, 'base64')
        const iv = encryptedBuffer.subarray(0, 16)
        const encrypted = encryptedBuffer.subarray(16)

        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ])

        return decrypted.toString('utf8')
    }

    private validateSecret(secret: string): void {
        const keyBuffer = Buffer.from(secret, 'base64')

        if (keyBuffer.length !== 32) {
            throw new Error('CRYPTO_SECRET must be 32 bytes (base64-encoded)')
        }
    }
}