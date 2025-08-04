import crypto from 'crypto'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'

export class NodeEncryptionService implements IEncryptionService {
    private readonly key: Buffer
    private readonly algorithm: string = 'aes-256-gcm'
    private readonly ivLength: number = 12
    private readonly authTagLength: number = 16

    constructor(secretBase64: string) {
        this.validateSecret(secretBase64)
        this.key = Buffer.from(secretBase64, 'base64')
    }

    public encrypt(plainText: string): string {
        const iv = crypto.randomBytes(this.ivLength)
        const cipher: crypto.CipherGCM = crypto.createCipheriv(
            this.algorithm, 
            this.key, 
            iv
        ) as crypto.CipherGCM
        
        const encrypted = Buffer.concat([
            cipher.update(plainText, 'utf8'),
            cipher.final()
        ])
        
        const authTag = cipher.getAuthTag()
        const combined = Buffer.concat([iv, encrypted, authTag])
        
        return combined.toString('base64')
    }

    public decrypt(encryptedText: string): string {
        const encryptedBuffer = Buffer.from(encryptedText, 'base64')
        
        if (encryptedBuffer.length < this.ivLength + this.authTagLength + 1) {
            throw new Error('Invalid encrypted data length')
        }
        
        const iv = encryptedBuffer.subarray(0, this.ivLength)
        const authTag = encryptedBuffer.subarray(encryptedBuffer.length - this.authTagLength)
        const encrypted = encryptedBuffer.subarray(this.ivLength, encryptedBuffer.length - this.authTagLength)
        
        const decipher: crypto.DecipherGCM = crypto.createDecipheriv(
            this.algorithm, 
            this.key, 
            iv
        ) as crypto.DecipherGCM
        
        decipher.setAuthTag(authTag)
        
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ])
        
        return decrypted.toString('utf8')
    }

    private validateSecret(secret: string): void {
        const keyBuffer = Buffer.from(secret, 'base64')

        if (keyBuffer.length !== 32) {
            throw new Error('ENCRYPTION_SECRET must be 32 bytes (base64-encoded)')
        }
    }
}