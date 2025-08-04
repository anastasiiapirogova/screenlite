export type SendEmailDTO = {
    to: string
    subject: string
    html: string
    text?: string
    from?: {
        name: string
        address: string
    }
}