import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { UploadLockService } from '../UploadLockService.js'
import { getRedisClient } from '@/config/redis.js'
import { FileUploadSession } from '@/generated/prisma/client.js'

;(BigInt.prototype as { toJSON?: () => string }).toJSON = function () {
    return this.toString()
}

describe('UploadLockService', () => {
    let redis: ReturnType<typeof getRedisClient>
    let mockFileUploadSession: FileUploadSession

    beforeAll(async () => {
        redis = getRedisClient()
    })

    afterAll(async () => {
        await redis.quit()
    })

    beforeEach(async () => {
        const keys = await redis.keys('upload_lock:*')

        if (keys.length > 0) {
            await redis.del(...keys)
        }

        await new Promise(resolve => setTimeout(resolve, 10))

        mockFileUploadSession = {
            id: 'test-session-id',
            name: 'test-file.txt',
            createdAt: new Date(),
            path: '/test/path',
            size: BigInt(1000),
            uploaded: BigInt(0),
            uploadedParts: 0,
            mimeType: 'text/plain',
            workspaceId: 'test-workspace-id',
            uploadId: 'test-upload',
            folderId: null,
            userId: 'test-user-id',
            completedAt: null,
            cancelledAt: null
        }
    })

    describe('acquireLock', () => {
        it('should acquire a lock successfully', async () => {
            const result = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            expect(result.acquired).toBe(true)
            expect(result.lockValue).toBeDefined()
            expect(typeof result.lockValue).toBe('string')
            expect(result.lockValue!.length).toBeGreaterThan(0)
        })

        it('should fail to acquire lock when already locked', async () => {
            const firstResult = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            expect(firstResult.acquired).toBe(true)

            const secondResult = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            expect(secondResult.acquired).toBe(false)
            expect(secondResult.lockValue).toBeUndefined()
        })

        it('should acquire locks for different part numbers', async () => {
            const result1 = await UploadLockService.acquireLock(mockFileUploadSession, 1)
            const result2 = await UploadLockService.acquireLock(mockFileUploadSession, 2)

            expect(result1.acquired).toBe(true)
            expect(result2.acquired).toBe(true)
            expect(result1.lockValue).not.toBe(result2.lockValue)
        })

        it('should acquire locks for different upload sessions', async () => {
            const session1 = { ...mockFileUploadSession, uploadId: 'upload-1' }
            const session2 = { ...mockFileUploadSession, uploadId: 'upload-2' }

            const result1 = await UploadLockService.acquireLock(session1, 1)
            const result2 = await UploadLockService.acquireLock(session2, 1)

            expect(result1.acquired).toBe(true)
            expect(result2.acquired).toBe(true)
        })

        it('should respect timeout parameter', async () => {
            const result = await UploadLockService.acquireLock(mockFileUploadSession, 1, 1000)

            expect(result.acquired).toBe(true)

            await new Promise(resolve => setTimeout(resolve, 1100))

            const result2 = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            expect(result2.acquired).toBe(true)
        })
    })

    describe('releaseLock', () => {
        it('should release a lock successfully', async () => {
            const acquireResult = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            expect(acquireResult.acquired).toBe(true)

            await UploadLockService.releaseLock(mockFileUploadSession, 1, acquireResult.lockValue!)

            const result2 = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            expect(result2.acquired).toBe(true)
        })

        it('should not release lock with wrong lock value', async () => {
            const acquireResult = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            expect(acquireResult.acquired).toBe(true)

            await UploadLockService.releaseLock(mockFileUploadSession, 1, 'wrong-lock-value')

            const result2 = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            expect(result2.acquired).toBe(false)
        })

        it('should handle releasing non-existent lock gracefully', async () => {
            await expect(
                UploadLockService.releaseLock(mockFileUploadSession, 999, 'some-value')
            ).resolves.not.toThrow()
        })
    })

    describe('isLocked', () => {
        it('should return true when lock exists', async () => {
            await UploadLockService.acquireLock(mockFileUploadSession, 1)
            const isLocked = await UploadLockService.isLocked(mockFileUploadSession, 1)

            expect(isLocked).toBe(true)
        })

        it('should return false when lock does not exist', async () => {
            const isLocked = await UploadLockService.isLocked(mockFileUploadSession, 999)

            expect(isLocked).toBe(false)
        })

        it('should return false after lock is released', async () => {
            const acquireResult = await UploadLockService.acquireLock(mockFileUploadSession, 1)

            await UploadLockService.releaseLock(mockFileUploadSession, 1, acquireResult.lockValue!)

            const isLocked = await UploadLockService.isLocked(mockFileUploadSession, 1)

            expect(isLocked).toBe(false)
        })
    })

    describe('getLockInfo', () => {
        it('should return lock info when lock exists', async () => {
            await UploadLockService.acquireLock(mockFileUploadSession, 1, 5000)
            const lockInfo = await UploadLockService.getLockInfo(mockFileUploadSession, 1)

            expect(lockInfo.exists).toBe(true)
            expect(lockInfo.ttl).toBeDefined()
            expect(lockInfo.ttl!).toBeGreaterThan(0)
            expect(lockInfo.ttl!).toBeLessThanOrEqual(5000)
        })

        it('should return exists false when lock does not exist', async () => {
            const lockInfo = await UploadLockService.getLockInfo(mockFileUploadSession, 999)

            expect(lockInfo.exists).toBe(false)
            expect(lockInfo.ttl).toBeUndefined()
        })
    })

    describe('forceReleaseLock', () => {
        it('should force release a lock', async () => {
            await UploadLockService.acquireLock(mockFileUploadSession, 1)
            
            const isLocked = await UploadLockService.isLocked(mockFileUploadSession, 1)

            expect(isLocked).toBe(true)

            await UploadLockService.forceReleaseLock(mockFileUploadSession, 1)

            const isLockedAfter = await UploadLockService.isLocked(mockFileUploadSession, 1)

            expect(isLockedAfter).toBe(false)
        })

        it('should handle force releasing non-existent lock gracefully', async () => {
            await expect(
                UploadLockService.forceReleaseLock(mockFileUploadSession, 999)
            ).resolves.not.toThrow()
        })
    })

    describe('concurrent access', () => {
        it('should handle multiple concurrent lock attempts', async () => {
            const promises = Array.from({ length: 5 }, () =>
                UploadLockService.acquireLock(mockFileUploadSession, 1)
            )

            const results = await Promise.all(promises)

            const successfulResults = results.filter(r => r.acquired)

            expect(successfulResults).toHaveLength(1)

            const failedResults = results.filter(r => !r.acquired)

            expect(failedResults).toHaveLength(4)
        })

        it('should allow concurrent locks for different parts', async () => {
            const promises = Array.from({ length: 5 }, (_, i) =>
                UploadLockService.acquireLock(mockFileUploadSession, i + 1)
            )

            const results = await Promise.all(promises)

            const successfulResults = results.filter(r => r.acquired)

            expect(successfulResults).toHaveLength(5)
        })

        it('should allow concurrent locks for different upload sessions', async () => {
            const session1 = { ...mockFileUploadSession, uploadId: 'upload-1' }
            const session2 = { ...mockFileUploadSession, uploadId: 'upload-2' }

            const promises = [
                UploadLockService.acquireLock(session1, 1),
                UploadLockService.acquireLock(session2, 1)
            ]

            const results = await Promise.all(promises)

            expect(results[0].acquired).toBe(true)
            expect(results[1].acquired).toBe(true)
        })
    })

    describe('lock key generation', () => {
        it('should generate unique keys for different combinations', async () => {
            const session1 = { ...mockFileUploadSession, uploadId: 'upload-1' }
            const session2 = { ...mockFileUploadSession, uploadId: 'upload-2' }

            const results = await Promise.all([
                UploadLockService.acquireLock(session1, 1),
                UploadLockService.acquireLock(session1, 2),
                UploadLockService.acquireLock(session2, 1),
                UploadLockService.acquireLock(session2, 2)
            ])

            const successfulResults = results.filter(r => r.acquired)

            expect(successfulResults).toHaveLength(4)
        })
    })
}) 