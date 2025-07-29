import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { services } from 'oldsrc/services/index.ts'
import { FileRestoreService } from 'oldsrc/modules/file/services/FileRestoreService.ts'

const WORKSPACE_ID = 'workspace-file-restore'

const generateId = (suffix = '') => `file-${Date.now()}${suffix}`

describe('FileRestoreService tests', () => {
    beforeAll(async () => {
        await services.prisma.client.workspace.upsert({
            where: { id: WORKSPACE_ID },
            update: {},
            create: { id: WORKSPACE_ID, name: 'Test Workspace', slug: WORKSPACE_ID, status: 'ACTIVE' },
        })
    })

    beforeEach(async () => {
        await services.prisma.client.file.deleteMany({
            where: {
                workspaceId: WORKSPACE_ID,
            }
        })
    })

    afterAll(async () => {
        await services.prisma.client.workspace.delete({
            where: { id: WORKSPACE_ID },
        })
    })

    it('should restore deleted files', async () => {
        const file1 = await services.prisma.client.file.create({
            data: {
                id: generateId('-1'),
                name: 'File 1',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                size: BigInt(100),
                mimeType: 'video/mp4',
                extension: 'txt',
                type: 'video',
                path: `/test/file1-${Date.now()}.mp4`,
            }
        })

        const file2 = await services.prisma.client.file.create({
            data: {
                id: generateId('-2'),
                name: 'File 2',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                size: BigInt(200),
                mimeType: 'video/mp4',
                extension: 'txt',
                type: 'video',
                path: `/test/file2-${Date.now()}.mp4`,
            }
        })

        const result = await FileRestoreService.restoreFiles([file1.id, file2.id], WORKSPACE_ID)

        expect(result.restoredFiles).toHaveLength(2)
        expect(result.restoredFiles).toContain(file1.id)
        expect(result.restoredFiles).toContain(file2.id)
        expect(result.alreadyRestoredFiles).toBeUndefined()
        expect(result.notFoundFiles).toBeUndefined()

        const restoredFile1 = await services.prisma.client.file.findUnique({ where: { id: file1.id } })
        const restoredFile2 = await services.prisma.client.file.findUnique({ where: { id: file2.id } })

        expect(restoredFile1?.deletedAt).toBeNull()
        expect(restoredFile2?.deletedAt).toBeNull()
    })

    it('should handle already restored files', async () => {
        const deletedFile = await services.prisma.client.file.create({
            data: {
                id: generateId('-deleted'),
                name: 'Deleted File',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                size: BigInt(100),
                mimeType: 'video/mp4',
                extension: 'txt',
                type: 'video',
                path: `/test/deleted-${Date.now()}.mp4`,
            }
        })

        const activeFile = await services.prisma.client.file.create({
            data: {
                id: generateId('-active'),
                name: 'Active File',
                workspaceId: WORKSPACE_ID,
                size: BigInt(200),
                mimeType: 'video/mp4',
                extension: 'txt',
                type: 'video',
                path: `/test/active-${Date.now()}.mp4`,
            }
        })

        const result = await FileRestoreService.restoreFiles([deletedFile.id, activeFile.id], WORKSPACE_ID)

        expect(result.restoredFiles).toHaveLength(1)
        expect(result.restoredFiles).toContain(deletedFile.id)
        expect(result.alreadyRestoredFiles).toHaveLength(1)
        expect(result.alreadyRestoredFiles).toContain(activeFile.id)
        expect(result.notFoundFiles).toBeUndefined()
    })

    it('should handle non-existent files', async () => {
        const nonExistentId = generateId('-nonexistent')

        const result = await FileRestoreService.restoreFiles([nonExistentId], WORKSPACE_ID)

        expect(result.restoredFiles).toHaveLength(0)
        expect(result.alreadyRestoredFiles).toBeUndefined()
        expect(result.notFoundFiles).toHaveLength(1)
        expect(result.notFoundFiles).toContain(nonExistentId)
    })

    it('should restore files with folder relationships', async () => {
        const folder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-folder'),
                name: 'Test Folder',
                workspaceId: WORKSPACE_ID,
            }
        })

        const file = await services.prisma.client.file.create({
            data: {
                id: generateId('-with-folder'),
                name: 'File with Folder',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                folderIdBeforeDeletion: folder.id,
                size: BigInt(100),
                mimeType: 'video/mp4',
                extension: 'txt',
                type: 'video',
                path: `/test/with-folder-${Date.now()}.mp4`,
            }
        })

        const result = await FileRestoreService.restoreFiles([file.id], WORKSPACE_ID)

        expect(result.restoredFiles).toHaveLength(1)
        expect(result.restoredFiles).toContain(file.id)

        const restoredFile = await services.prisma.client.file.findUnique({ where: { id: file.id } })

        expect(restoredFile?.deletedAt).toBeNull()
        expect(restoredFile?.folderId).toBe(folder.id)
        expect(restoredFile?.folderIdBeforeDeletion).toBeNull()
    })

    it('should handle deleted folders when restoring files', async () => {
        const deletedFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-deleted-folder'),
                name: 'Deleted Folder',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
            }
        })

        const file = await services.prisma.client.file.create({
            data: {
                id: generateId('-with-deleted-folder'),
                name: 'File with Deleted Folder',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                folderIdBeforeDeletion: deletedFolder.id,
                size: BigInt(100),
                mimeType: 'video/mp4',
                extension: 'txt',
                type: 'video',
                path: `/test/with-deleted-folder-${Date.now()}.mp4`,
            }
        })

        const result = await FileRestoreService.restoreFiles([file.id], WORKSPACE_ID)

        expect(result.restoredFiles).toHaveLength(1)
        expect(result.restoredFiles).toContain(file.id)

        const restoredFile = await services.prisma.client.file.findUnique({ where: { id: file.id } })

        expect(restoredFile?.deletedAt).toBeNull()
        expect(restoredFile?.folderId).toBeNull()
        expect(restoredFile?.folderIdBeforeDeletion).toBeNull()
    })
})
