import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'
import { beforeEach, describe, it, vi, expect } from 'vitest'
import { ZodIssue } from 'zod'

describe('ResponseHandler', () => {
    let mockRes: Partial<Response>
    let mockReq: Partial<Request>

    beforeEach(() => {
        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn()
        }
        mockReq = {}
    })

    describe('ResponseHandler.json', () => {
        it('sends JSON with status 200 if data is provided', () => {
            ResponseHandler.json(mockRes as Response, { message:'ok' })

            expect(mockRes.status).toHaveBeenCalledWith(200)
            expect(mockRes.json).toHaveBeenCalledWith({ message:'ok' })
        })

        it('sends empty response if no data is provided', () => {
            ResponseHandler.json(mockRes as Response)
            
            expect(mockRes.status).toHaveBeenCalledWith(200)
            expect(mockRes.send).toHaveBeenCalledWith()
        })
    })

    describe('ResponseHandler.paginated', () => {
        it('calculates "pages" meta data', () => {
            using spy = vi.spyOn(ResponseHandler, 'json').mockImplementation(() => {})

            const data = [{ id: 1 }]
            const meta = { total: 10, limit:3, page:1 }

            ResponseHandler.paginated(mockRes as Response, data, meta)

            expect(spy).toHaveBeenCalledWith(
                mockRes,
                { data, meta: { ...meta, pages : 4 } },
            )

            const callInfo = spy.mock.calls[0][1]

            expect(callInfo?.data).toStrictEqual([{ id: 1 }])
            expect(callInfo?.meta).toStrictEqual({ total: 10, limit: 3, page: 1, pages: 4 })

            expect(mockRes.json).not.toHaveBeenCalled()
            expect(mockRes.status).not.toHaveBeenCalled()
        })
    })

    describe('ResponseHandler.ok', () => {
        it('sends JSON in response if data is provided', () => {
            using responseHandlerSpy = vi.spyOn(ResponseHandler, 'json').mockImplementation(() => {})

            ResponseHandler.ok(mockRes as Response, { message:'success' })
            
            expect(responseHandlerSpy).toHaveBeenCalledWith(
                mockRes,
                { message:'success' }
            )
        })

        it('sends empty reponse if no data is provided', () => {
            using responseHandlerSpy = vi.spyOn(ResponseHandler, 'json').mockImplementation(() => {})

            ResponseHandler.ok(mockRes as Response)
            
            expect(responseHandlerSpy).toHaveBeenCalledWith(mockRes, undefined)
        })
    })

    describe('ResponseHandler.tooManyRequests', () => {
        it('should reponse with message and status', () => {
            ResponseHandler.tooManyRequests(mockRes as Response)

            expect(mockRes.status).toHaveBeenCalledWith(429)
            expect(mockRes.send).toHaveBeenCalledWith('Too Many Requests')
        })
    })

    describe('ResponseHandler.serverError', () => {
        it('sends error message if message is provided', () => {
            ResponseHandler.serverError(mockRes as Response, 'server error' )

            expect(mockRes.status).toHaveBeenCalledWith(500)
            expect(mockRes.send).toHaveBeenCalledWith('server error')
        })

        it('should send default message if message is not provided', () => {
            ResponseHandler.serverError(mockRes as Response)

            expect(mockRes.status).toHaveBeenCalledWith(500)
            expect(mockRes.send).toHaveBeenCalledWith('Internal Server Error')
        })
    })

    describe('ResponseHandler.notModified', () => {
        it('send empty reponse with status', () => {
            ResponseHandler.notModified(mockRes as Response)

            expect(mockRes.status).toHaveBeenCalledWith(304)
            expect(mockRes.send).toHaveBeenCalledWith()
        })
    })

    describe('ResponseHandler.empty', () => {
        it('send empty reponse with status', () => {
            ResponseHandler.empty(mockRes as Response)

            expect(mockRes.status).toHaveBeenCalledWith(204)
            expect(mockRes.send).toHaveBeenCalledWith()
        })
    })

    describe('ResponseHandler.ok', () => {
        it('sends JSON in response with data', () => {
            using responseHandlerSpy = vi.spyOn(ResponseHandler, 'json').mockImplementation(() => {})

            ResponseHandler.created(mockRes as Response, { message:'success' })
            
            expect(responseHandlerSpy).toHaveBeenCalledWith(
                mockRes,
                { message:'success' },
                201
            )
        })
    })

    describe('ResponseHandler.tooLarge', () => {
        it('sends error message if message is provided', () => {
            ResponseHandler.tooLarge(mockRes as Response, 'not supported above 50MB' )

            expect(mockRes.status).toHaveBeenCalledWith(413)
            expect(mockRes.send).toHaveBeenCalledWith('not supported above 50MB')
        })

        it('should send default message if message is not provided', () => {
            ResponseHandler.tooLarge(mockRes as Response)

            expect(mockRes.status).toHaveBeenCalledWith(413)
            expect(mockRes.send).toHaveBeenCalledWith('Too Large')
        })
    })

    describe('ResponseHandler.forbidden', () => {
        it('sends error message if message is provided', () => {
            ResponseHandler.forbidden(mockRes as Response, 'not supported' )

            expect(mockRes.status).toHaveBeenCalledWith(403)
            expect(mockRes.send).toHaveBeenCalledWith('not supported')
        })

        it('should send default message if message is not provided', () => {
            ResponseHandler.forbidden(mockRes as Response)

            expect(mockRes.status).toHaveBeenCalledWith(403)
            expect(mockRes.send).toHaveBeenCalledWith('Forbidden')
        })
    })

    describe('ResponseHandler.notFound', () => {
        it('sends error message if message is provided', () => {
            ResponseHandler.notFound(mockRes as Response, 'Video has been removed' )

            expect(mockRes.status).toHaveBeenCalledWith(404)
            expect(mockRes.send).toHaveBeenCalledWith('Video has been removed')
        })

        it('should send default message if message is not provided', () => {
            ResponseHandler.notFound(mockRes as Response)

            expect(mockRes.status).toHaveBeenCalledWith(404)
            expect(mockRes.send).toHaveBeenCalledWith('Not Found')
        })
    })

    describe('ResponseHandler.unauthorized', () => {
        it('send empty reponse with status', () => {
            ResponseHandler.unauthorized(mockRes as Response)

            expect(mockRes.status).toHaveBeenCalledWith(401)
            expect(mockRes.send).toHaveBeenCalledWith('Unauthorized')
        })
    })

    

    describe('ResponseHandler.zodError', () => {
        it('formats Zod issues into error messages', () => {
            const issues = [
                { path: ['email'], message: 'Invalid email' },
                { path: ['age'], message: 'Age must be a number' },
            ] as ZodIssue[]

            ResponseHandler.zodError(mockReq as Request, mockRes as Response, issues)
            
            expect(mockRes.status).toHaveBeenCalledWith(400)
            expect(mockRes.json).toHaveBeenCalledWith({
                errors: {
                    email: 'Invalid email',
                    age: 'Age must be a number',
                }
            })
        })
    })

    describe('ResponseHandler.validationError', () => {
        it('translate error and sends response in JSON with status', () => {
            const errors = {
                email: 'Email is invalid',
                password: 'Password too short',
            }

            ResponseHandler.validationError(mockReq as Request, mockRes as Response, errors)
            
            expect(mockRes.status).toHaveBeenCalledWith(400)
            expect(mockRes.json).toHaveBeenCalledWith({
                errors
            })
        })
    })
})