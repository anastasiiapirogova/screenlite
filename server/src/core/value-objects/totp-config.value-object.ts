export class TotpConfig {
    constructor(
        public readonly encryptedSecret: string,
        public readonly algorithm: string,
        public readonly digits: number,
        public readonly period: number,
    ) {
        if (!encryptedSecret || encryptedSecret.trim() === '') {
            throw new Error('TOTP secret is required')
        }

        if (!algorithm || algorithm.trim() === '') {
            throw new Error('TOTP algorithm is required')
        }

        if (!digits || digits < 6 || digits > 8) {
            throw new Error('TOTP digits must be between 6 and 8')
        }

        if (!period || period < 15 || period > 300) {
            throw new Error('TOTP period must be between 15 and 300 seconds')
        }
    }
}