export interface ITotpService {
    generateCode(secret: string, algorithm?: string, digits?: number, period?: number): Promise<string>
    verifyCode(secret: string, code: string, window?: number, algorithm?: string, digits?: number, period?: number): Promise<boolean>
    generateSecret(): string
    generateQrCodeUrl(secret: string, accountName: string, issuer?: string, digits?: number, period?: number, algorithm?: string): string
}