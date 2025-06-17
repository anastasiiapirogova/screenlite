import { getIpFromRequest } from '@utils/getIpFromRequest.js'
import { Request } from 'express'
import { describe, expect, it, } from 'vitest'

describe('getIpFromRequest', () => {
    let mockReq : Partial<Request>

    it('should handle X-Forwarded-For header', () => {
        mockReq = {
            headers : {
                'x-forwarded-for': '203.0.113.45, 198.51.100.100'
            }
        }
        const res = getIpFromRequest(mockReq as Request)
        
        expect(res).toBe('203.0.113.45')
    })

    it('should return the IP from req.ip', () => {
        mockReq = {
            ip:'192.168.1.1',
            headers : {
                'x-forwarded-for': '',
            },
        }
        const res = getIpFromRequest(mockReq as Request)

        expect(res).toBe('192.168.1.1')
    })
})