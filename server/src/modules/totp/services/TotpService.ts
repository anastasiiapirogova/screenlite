import crypto from 'crypto'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

const ENCRYPTION_KEY = crypto
    .createHash('sha256')
    .update(process.env.TOTP_ENCRYPTION_KEY || 'insecure-default-key')
    .digest()

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

export class TotpService {
    static generateSecret(length: number = 20): string {
        const randomBytes = crypto.randomBytes(length)
        let bits = ''

        for (const byte of randomBytes) {
            bits += byte.toString(2).padStart(8, '0')
        }

        let secret = ''

        for (let i = 0; i + 5 <= bits.length; i += 5) {
            const chunk = bits.substring(i, i + 5)

            secret += BASE32_ALPHABET[parseInt(chunk, 2)]
        }

        return secret
    }

    static base32ToBuffer(base32: string): Buffer {
        let bits = ''
        const clean = base32.replace(/=+$/, '').toUpperCase()

        for (const char of clean) {
            const val = BASE32_ALPHABET.indexOf(char)

            if (val === -1) throw new Error('Invalid base32 character')
            bits += val.toString(2).padStart(5, '0')
        }

        const bytes: number[] = []

        for (let i = 0; i + 8 <= bits.length; i += 8) {
            bytes.push(parseInt(bits.substring(i, i + 8), 2))
        }

        return Buffer.from(bytes)
    }

    static generateToken(secret: string, offset: number = 0): string {
        const timeStep = 30
        const counter = Math.floor(Date.now() / 1000 / timeStep) + offset

        const buffer = Buffer.alloc(8)

        buffer.writeUInt32BE(0, 0)
        buffer.writeUInt32BE(counter, 4)

        const key = TotpService.base32ToBuffer(secret)
        const hmac = crypto.createHmac('sha1', key).update(buffer).digest()
        const offsetByte = hmac[hmac.length - 1] & 0x0f

        const binary =
			((hmac[offsetByte] & 0x7f) << 24) |
			((hmac[offsetByte + 1] & 0xff) << 16) |
			((hmac[offsetByte + 2] & 0xff) << 8) |
			(hmac[offsetByte + 3] & 0xff)

        const otp = (binary % 10 ** 6).toString().padStart(6, '0')

        return otp
    }

    static verifyToken(secret: string, token: string, window: number = 1): boolean {
        for (let offset = -window; offset <= window; offset++) {
            const valid = TotpService.generateToken(secret, offset)

            if (token === valid) return true
        }
        return false
    }

    static getOtpAuthUrl(secret: string, email: string, appName: string): string {
        return `otpauth://totp/${appName}:${email}?secret=${secret}&issuer=${appName}`
    }

    static encryptSecret(plainSecret: string): string {
        const iv = crypto.randomBytes(IV_LENGTH)
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)

        const encrypted = Buffer.concat([
            cipher.update(plainSecret, 'utf8'),
            cipher.final(),
        ])

        const tag = cipher.getAuthTag()

        return Buffer.concat([iv, tag, encrypted]).toString('base64')
    }

    static decryptSecret(encryptedSecret: string): string {
        const data = Buffer.from(encryptedSecret, 'base64')

        const iv = data.subarray(0, IV_LENGTH)
        const tag = data.subarray(IV_LENGTH, IV_LENGTH + 16)
        const encrypted = data.subarray(IV_LENGTH + 16)

        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)

        decipher.setAuthTag(tag)

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ])

        return decrypted.toString('utf8')
    }
}
