type ForbiddenErrorData = {
    details: Record<string, string[] | string>
    code?: string
    message?: string
}

export class ForbiddenError extends Error {
    public readonly details: Record<string, string[] | string>
    public readonly code: string
    public readonly message: string

    constructor(data: ForbiddenErrorData) {
        super(data.message)

        this.details = data.details
        this.code = data.code ?? 'FST_ERR_FORBIDDEN'
        this.message = data.message ?? 'Forbidden Error'
    }
}