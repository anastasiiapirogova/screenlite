export type SetupTotpConfigDTO = {
    algorithm: string
    digits: number
    period: number
    secret: string
    url: string
}