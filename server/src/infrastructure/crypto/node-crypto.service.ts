import crypto from 'crypto'
import { CryptoServiceInterface } from '@/core/ports/crypto.interface.ts'

export class NodeCryptoService implements CryptoServiceInterface {
    private readonly key: Buffer
    private readonly iv: Buffer
    private readonly algorithm: string

    constructor(secretBase64: string, algorithm: string = 'aes-256-cbc') {
        this.validateSecret(secretBase64)
        
        const secretBuffer = Buffer.from(secretBase64, 'base64')

        this.key = secretBuffer.subarray(0, 32)
        this.iv = secretBuffer.subarray(32, 48)
        this.algorithm = algorithm
    }

    public encrypt(plainText: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv)

        return cipher.update(plainText, 'utf8', 'base64') + cipher.final('base64')
    }

    public decrypt(encryptedText: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv)

        return decipher.update(encryptedText, 'base64', 'utf8') + decipher.final('utf8')
    }

    private validateSecret(secret: string): void {
        if (Buffer.from(secret, 'base64').length !== 48) {
            throw new Error('CRYPTO_SECRET must be 48 bytes (base64-encoded)')
        }
    }
}