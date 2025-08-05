import { ITotpService } from '../../domain/ports/totp-service.interface.ts'
import crypto from 'crypto'

export class TotpService implements ITotpService {
    private static readonly BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    private static readonly DEFAULT_ALGORITHM = 'SHA1'
    private static readonly DEFAULT_DIGITS = 6
    private static readonly DEFAULT_PERIOD = 30
    private static readonly DEFAULT_WINDOW = 1
    private static readonly DEFAULT_SECRET_LENGTH = 20

    async generateCode(
        secret: string,
        algorithm: string = TotpService.DEFAULT_ALGORITHM,
        digits: number = TotpService.DEFAULT_DIGITS,
        period: number = TotpService.DEFAULT_PERIOD
    ): Promise<string> {
        return this.generateCodeForTime(secret, Math.floor(Date.now() / 1000 / period), algorithm, digits)
    }

    async verifyCode(
        secret: string,
        code: string,
        window: number = TotpService.DEFAULT_WINDOW,
        algorithm: string = TotpService.DEFAULT_ALGORITHM,
        digits: number = TotpService.DEFAULT_DIGITS,
        period: number = TotpService.DEFAULT_PERIOD
    ): Promise<boolean> {
        if (code.length !== digits) return false
        
        const currentTime = Math.floor(Date.now() / 1000 / period)
        let isValid = false

        for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
            const time = currentTime + errorWindow
            const generatedCode = await this.generateCodeForTime(secret, time, algorithm, digits)

            if (this.constantTimeCompare(generatedCode, code)) {
                isValid = true
            }
        }

        return isValid
    }

    generateSecret(length: number = TotpService.DEFAULT_SECRET_LENGTH): string {
        const randomBytes = crypto.randomBytes(length)
        let secret = ''
        let buffer = 0
        let bitsCount = 0

        for (const byte of randomBytes) {
            buffer = (buffer << 8) | byte
            bitsCount += 8

            while (bitsCount >= 5) {
                bitsCount -= 5
                const index = (buffer >>> bitsCount) & 0x1f

                secret += TotpService.BASE32_ALPHABET[index]
            }
        }

        return secret
    }

    generateQrCodeUrl(
        secret: string,
        accountName: string,
        issuer: string = 'Screenlite',
        digits: number = TotpService.DEFAULT_DIGITS,
        period: number = TotpService.DEFAULT_PERIOD,
        algorithm: string = TotpService.DEFAULT_ALGORITHM
    ): string {
        const label = encodeURIComponent(`${issuer}:${accountName}`)
        const params = new URLSearchParams({
            secret,
            issuer,
            digits: digits.toString(),
            period: period.toString(),
            algorithm: algorithm.toUpperCase()
        })

        return `otpauth://totp/${label}?${params.toString()}`
    }

    private async generateCodeForTime(
        secret: string,
        time: number,
        algorithm: string,
        digits: number
    ): Promise<string> {
        const key = this.base32ToBytes(secret)
        const timeBuffer = this.intToBuffer(time)
        const hmac = this.hmacSha(algorithm, key, timeBuffer)
        const codeInt = this.truncate(hmac) % (10 ** digits)

        return codeInt.toString().padStart(digits, '0')
    }

    private base32ToBytes(base32: string): Uint8Array {
        const sanitized = base32.replace(/=+$/, '').toUpperCase()
        let bits = ''

        for (const char of sanitized) {
            const val = TotpService.BASE32_ALPHABET.indexOf(char)

            if (val === -1) throw new Error(`Invalid base32 character: ${char}`)
            bits += val.toString(2).padStart(5, '0')
        }

        const bytes = []

        for (let i = 0; i + 8 <= bits.length; i += 8) {
            bytes.push(parseInt(bits.slice(i, i + 8), 2))
        }

        return new Uint8Array(bytes)
    }

    private intToBuffer(num: number): Uint8Array {
        const buffer = new ArrayBuffer(8)
        const view = new DataView(buffer)

        view.setUint32(0, 0, false)
        view.setUint32(4, num, false)
        return new Uint8Array(buffer)
    }

    private truncate(hmac: Uint8Array): number {
        const offset = hmac[hmac.length - 1] & 0xf

        return (
            ((hmac[offset] & 0x7f) << 24) |
            ((hmac[offset + 1] & 0xff) << 16) |
            ((hmac[offset + 2] & 0xff) << 8) |
            (hmac[offset + 3] & 0xff)
        )
    }

    private hmacSha(
        algorithm: string,
        key: Uint8Array,
        msg: Uint8Array
    ): Uint8Array {
        const hmac = crypto.createHmac(algorithm.toLowerCase(), Buffer.from(key))

        hmac.update(Buffer.from(msg))
        return new Uint8Array(hmac.digest())
    }

    private constantTimeCompare(a: string, b: string): boolean {
        if (a.length !== b.length) return false
        
        let result = 0

        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i)
        }
        return result === 0
    }
}