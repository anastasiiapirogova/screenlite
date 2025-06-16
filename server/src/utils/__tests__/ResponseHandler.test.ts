import { ResponseHandler } from '@utils/ResponseHandler.js'
import { Request, Response } from 'express'
import {beforeEach, describe, it, vi, expect} from 'vitest'
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
        mockReq = {
            t: vi.fn((msg) => msg)
        }
    })
    describe('ResponseHandler.json', () => {
        it('sends JSON with status 200 if data is provided', () => {
            ResponseHandler.json(mockRes as Response, {message:'ok'})
            expect(mockRes.status).toHaveBeenCalledWith(200)
            expect(mockRes.json).toHaveBeenCalledWith({message:'ok'})
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

            const data = [{id: 1}]
            const meta = {total: 10, limit:3, page:1}

            ResponseHandler.paginated(mockRes as Response, data, meta)

            expect(spy).toHaveBeenCalledWith(
                mockRes,
                { data, meta: {...meta, pages : 4} },
            )
            expect(mockRes.json).not.toHaveBeenCalled()
            expect(mockRes.status).not.toHaveBeenCalled()
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

    
})