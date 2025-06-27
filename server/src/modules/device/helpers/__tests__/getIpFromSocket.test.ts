import { getIpFromSocket } from '../getIpFromSocket.ts'
import { Socket } from 'socket.io'
import { describe, expect, it, beforeEach } from 'vitest'

type MockSocket = {
    handshake: {
        headers: Record<string, string>
        address: string
    }
}

describe('getIpFromSocket', () => {
    let mockSocket: MockSocket

    beforeEach(() => {
        mockSocket = {
            handshake: {
                headers: {},
                address: ''
            }
        }
    })

    it('should handle X-Forwarded-For header with single IP', () => {
        const headers = {
            'x-forwarded-for': '203.0.113.45'
        }

        mockSocket.handshake = {
            headers,
            address: '192.168.1.1'
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('203.0.113.45')
    })

    it('should handle X-Forwarded-For header with multiple IPs', () => {
        const headers = {
            'x-forwarded-for': '203.0.113.45, 198.51.100.100, 10.0.0.1'
        }

        mockSocket.handshake = {
            headers,
            address: '192.168.1.1'
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('203.0.113.45')
    })

    it('should handle X-Forwarded-For header with spaces', () => {
        const headers = {
            'x-forwarded-for': ' 203.0.113.45 , 198.51.100.100 '
        }

        mockSocket.handshake = {
            headers,
            address: '192.168.1.1'
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('203.0.113.45')
    })

    it('should fallback to socket address when X-Forwarded-For is empty', () => {
        const headers = {
            'x-forwarded-for': ''
        }

        mockSocket.handshake = {
            headers,
            address: '192.168.1.1'
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('192.168.1.1')
    })

    it('should fallback to socket address when X-Forwarded-For is not present', () => {
        const headers = {}

        mockSocket.handshake = {
            headers,
            address: '192.168.1.1'
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('192.168.1.1')
    })

    it('should handle IPv6 mapped IPv4 addresses', () => {
        const headers = {}

        mockSocket.handshake = {
            headers,
            address: '::ffff:192.168.1.1'
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('192.168.1.1')
    })

    it('should handle IPv6 localhost', () => {
        const headers = {}

        mockSocket.handshake = {
            headers,
            address: '::1'
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('127.0.0.1')
    })

    it('should handle IPv6 mapped IPv4 in X-Forwarded-For', () => {
        const headers = {
            'x-forwarded-for': '::ffff:203.0.113.45'
        }

        mockSocket.handshake = {
            headers,
            address: '192.168.1.1'
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('203.0.113.45')
    })

    it('should throw error when no IP is found', () => {
        const headers = {}

        mockSocket.handshake = {
            headers,
            address: ''
        }

        expect(() => getIpFromSocket(mockSocket as Socket)).toThrow('IP_ADDRESS_NOT_FOUND')
    })

    it('should throw error when X-Forwarded-For contains only empty values', () => {
        const headers = {
            'x-forwarded-for': ' , , '
        }

        mockSocket.handshake = {
            headers,
            address: ''
        }

        expect(() => getIpFromSocket(mockSocket as Socket)).toThrow('IP_ADDRESS_NOT_FOUND')
    })

    it('should handle socket address with leading/trailing spaces', () => {
        const headers = {}

        mockSocket.handshake = {
            headers,
            address: '  192.168.1.1  '
        }

        const result = getIpFromSocket(mockSocket as Socket)

        expect(result).toBe('192.168.1.1')
    })
}) 