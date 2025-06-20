import { Request, Response } from 'express'
import { PaginationMeta } from 'types.js'
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

    static paginated(res: Response, data: Record<string, unknown>[], meta: PaginationMeta) {
        const pages = Math.max(meta.pages ?? Math.ceil(meta.total / meta.limit), 1)

        ResponseHandler.json(res, {
            data,
            meta: {
                ...meta,
                pages
            }
        })
    }

    static ok(res: Response, data?: Record<string, unknown>) {
        ResponseHandler.json(res, data)
    }

    static tooManyRequests(req: Request, res: Response) {
        req.resume()
        res.status(429).send('Too Many Requests')
    }

    static serverError(req: Request, res: Response, message?: string) {
        req.resume()
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

    static tooLarge(req: Request, res: Response, message?: string) {
        req.resume()
        res.status(413).send(message || 'Too Large')
    }

    static forbidden(req: Request, res: Response, message?: string) {
        req.resume()
        res.status(403).send(message || 'Forbidden')
    }

    static notFound(req: Request, res: Response, message?: string) {
        req.resume()
        res.status(404).send(message || 'Not Found')
    }

    static unauthorized(req: Request, res: Response) {
        req.resume()
        res.status(401).send('Unauthorized')
    }

    static zodError = (req: Request, res: Response, issues: ZodIssue[]) => {
        req.resume()

        const errors = issues.reduce((acc: Record<string, string>, issue) => {
            const key = issue.path.join('.')

            if(req.t) {
                acc[key] = req.t(issue.message)
            } else {
                acc[key] = issue.message
            }

            return acc
        }, {})

        res.status(400).json({ errors })
    }

    static validationError = (req: Request, res: Response, errors: Record<string, string>) => {
        req.resume()
        
        const translatedErrors = Object.keys(errors).reduce((acc: Record<string, string>, key) => {
            if(req.t) {
                acc[key] = req.t(errors[key]) || errors[key]
            } else {
                acc[key] = errors[key]
            }

            return acc
        }, {})

        res.status(400).json({ errors: translatedErrors })
    }
}