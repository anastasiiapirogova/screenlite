import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { uploadFilePart } from 'oldsrc/modules/fileUpload/controllers/uploadFilePart.ts'
import { WORKSPACE_ROLES } from 'oldsrc/modules/workspace/accessControl/roles.ts'
import { services } from 'oldsrc/services/index.ts'

vi.mock('@/config/storage.ts', () => ({
    MultipartFileUploader: {
        uploadPart: vi.fn().mockResolvedValue(undefined)
    },
}))

vi.mock('../../repositories/FileUploadRepository.ts', () => ({
    FileUploadRepository: {
        updateSession: vi.fn().mockResolvedValue({
            id: 'test-session-id',
            uploadId: 'test-upload-id',
            uploadedParts: 1,
            completedAt: null,
            cancelledAt: null
        })
    }
}))

vi.mock('../../utils/FileUploadSessionValidator.ts', () => ({
    FileUploadSessionValidator: {
        validate: vi.fn().mockResolvedValue({
            id: 'test-session-id',
            uploadId: 'test-upload-id',
            uploadedParts: 0,
            completedAt: null,
            cancelledAt: null,
            userId: 'test-user-id',
            workspaceId: 'test-workspace-id'
        })
    }
}))

vi.mock('../../utils/ContentLengthValidator.ts', () => ({
    ContentLengthValidator: {
        validate: vi.fn().mockReturnValue(100)
    }
}))

vi.mock('../../../file/repositories/FileRepository.ts', () => ({
    FileRepository: {
        createFileFromFileUploadSession: vi.fn().mockResolvedValue({
            id: 'test-file-id'
        })
    }
}))

vi.mock('../../utils/addCompleteMultipartUploadJob.ts', () => ({
    addCompleteMultipartUploadJob: vi.fn()
}))

;(BigInt.prototype as { toJSON?: () => string }).toJSON = function () {
    return this.toString()
}

const app = express()

app.use((req, res, next) => {
    req.user = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        hasPassedTwoFactorAuth: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        emailVerifiedAt: null,
        twoFactorEnabled: false,
        passwordUpdatedAt: null,
        profilePhoto: null
    }

    req.workspace = {
        id: 'test-workspace-id',
        name: 'Test Workspace',
        slug: 'test-workspace',
        status: 'ACTIVE',
        picture: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        currentUserAccess: {
            role: WORKSPACE_ROLES.OWNER,
            permissions: {}
        }
    }

    next()
})

app.post('/upload/:fileUploadSessionId', async (req, res) => {
    try {
        await uploadFilePart(req, res)
    } catch (error) {
        console.error('Test error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

describe('uploadFilePart controller', () => {
    let redis: ReturnType<typeof services.redis.getClient>

    beforeAll(async () => {
        redis = services.redis.getClient()

        const keys = await redis.keys('upload_lock:test-upload-id:*')

        if (keys.length > 0) {
            await redis.del(...keys)
        }
    })

    afterAll(async () => {
        const keys = await redis.keys('upload_lock:test-upload-id:*')

        if (keys.length > 0) {
            await redis.del(...keys)
        }

        await redis.quit()
    })

    beforeEach(() => {
        vi.clearAllMocks()

        return redis.keys('upload_lock:test-upload-id:*').then(keys => {
            if (keys.length > 0) {
                return redis.del(...keys)
            }
        })
    })

    it('should upload a part successfully', async () => {
        const res = await request(app)
            .post('/upload/test-session-id')
            .send('testdata')
            .set('Content-Type', 'application/octet-stream')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('fileUploadSession')
    })

    it('should handle concurrent uploads of the same part', async () => {
        const sessionId = 'concurrent-test-session'
        const uploadId = 'concurrent-test-upload'

        const { FileUploadSessionValidator } = await import('oldsrc/modules/fileUpload/utils/FileUploadSessionValidator.ts')

        vi.mocked(FileUploadSessionValidator.validate)
            .mockResolvedValue({
                id: sessionId,
                name: 'test-file.txt',
                createdAt: new Date(),
                path: '/test/path',
                size: BigInt(1000),
                uploaded: BigInt(0),
                uploadedParts: 0,
                mimeType: 'text/plain',
                workspaceId: 'test-workspace-id',
                uploadId: uploadId,
                folderId: null,
                userId: 'test-user-id',
                completedAt: null,
                cancelledAt: null
            })

        const promises = [
            request(app)
                .post(`/upload/${sessionId}`)
                .send('testdata1')
                .set('Content-Type', 'application/octet-stream'),
            request(app)
                .post(`/upload/${sessionId}`)
                .send('testdata2')
                .set('Content-Type', 'application/octet-stream')
        ]

        const results = await Promise.all(promises)

        const statusCodes = results.map(r => r.status).sort()

        expect(statusCodes).toEqual([200, 409])

        const successResponse = results.find(r => r.status === 200)
        const conflictResponse = results.find(r => r.status === 409)

        expect(successResponse?.body).toHaveProperty('fileUploadSession')
        expect(conflictResponse?.text).toBe('PART_UPLOAD_IN_PROGRESS')
    })
})