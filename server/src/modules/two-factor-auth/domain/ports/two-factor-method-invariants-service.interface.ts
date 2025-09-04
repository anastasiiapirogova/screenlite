export interface ITwoFactorMethodInvariantsService {
    enforceTotpMethodIsNotEnabled(userId: string): Promise<void>
}