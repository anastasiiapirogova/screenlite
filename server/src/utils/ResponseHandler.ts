import { Request, Response } from 'express'
import { ZodIssue } from 'zod'

export class ResponseHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static json(res: Response, data?: Record<string, any>, status = 200) {
        if(data) {
            res.status(status).json(data)
        } else {
            res.status(status).send()
        }
    }

    static ok(res: Response, data?: Record<string, unknown>) {
        ResponseHandler.json(res, data)
    }

    static tooManyRequests(res: Response) {
        res.status(429).send('Too Many Requests')
    }

    static serverError(res: Response, message?: string) {
        res.status(500).send(message || 'Internal Server Error')
    }

    static notModified(res: Response) {
        res.status(304).send()
    }

    static empty(res: Response) {
        res.status(204).send()
    }

    static created(res: Response, data: Record<string, unknown>) {
        ResponseHandler.json(res, data, 201)
    }

    static forbidden(res: Response, message?: string) {
        res.status(403).send(message || 'Forbidden')
    }

    static notFound(res: Response, message?: string) {
        res.status(404).send(message || 'Not Found')
    }

    static unauthorized(res: Response) {
        res.status(401).send('Unauthorized')
    }

    static zodError = (req: Request, res: Response, issues: ZodIssue[]) => {
        const errors = issues.reduce((acc: Record<string, string>, issue) => {
            const key = issue.path.join('.')

            acc[key] = req.t(issue.message)
            return acc
        }, {})

        res.status(400).json({ errors })
    }

    static validationError = (req: Request, res: Response, errors: Record<string, string>) => {
        const translatedErrors = Object.keys(errors).reduce((acc: Record<string, string>, key) => {
            acc[key] = req.t(errors[key]) || errors[key]
            return acc
        }, {})

        res.status(400).json({ errors: translatedErrors })
    }
}