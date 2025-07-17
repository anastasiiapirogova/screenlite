import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { FolderRestoreService } from 'oldsrc/modules/folder/services/FolderRestoreService.ts'
import { services } from 'oldsrc/services/index.ts'

const WORKSPACE_ID = 'workspace-folder-restore'

const generateId = (suffix = '') => `folder-${Date.now()}${suffix}`

describe('FolderRestoreService tests', () => {
    beforeAll(async () => {
        await services.prisma.client.workspace.upsert({
            where: { id: WORKSPACE_ID },
            update: {},
            create: { id: WORKSPACE_ID, name: 'Test Workspace', slug: WORKSPACE_ID, status: 'ACTIVE' },
        })
    })

    beforeEach(async () => {
        await services.prisma.client.folder.deleteMany({
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

    it('should restore deleted folders', async () => {
        const folder1 = await services.prisma.client.folder.create({
            data: {
                id: generateId('-1'),
                name: 'Folder 1',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date()
            }
        })

        const folder2 = await services.prisma.client.folder.create({
            data: {
                id: generateId('-2'),
                name: 'Folder 2',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date()
            }
        })

        const result = await FolderRestoreService.restoreFolders([folder1.id, folder2.id], WORKSPACE_ID)

        expect(result.restoredFolders).toHaveLength(2)
        expect(result.restoredFolders).toContain(folder1.id)
        expect(result.restoredFolders).toContain(folder2.id)
        expect(result.alreadyRestoredFolders).toBeUndefined()
        expect(result.notFoundFolders).toBeUndefined()

        const restoredFolder1 = await services.prisma.client.folder.findUnique({ where: { id: folder1.id } })
        const restoredFolder2 = await services.prisma.client.folder.findUnique({ where: { id: folder2.id } })

        expect(restoredFolder1?.deletedAt).toBeNull()
        expect(restoredFolder2?.deletedAt).toBeNull()
    })

    it('should handle already restored folders', async () => {
        const deletedFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-deleted'),
                name: 'Deleted Folder',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date()
            }
        })

        const activeFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-active'),
                name: 'Active Folder',
                workspaceId: WORKSPACE_ID
            }
        })

        const result = await FolderRestoreService.restoreFolders([deletedFolder.id, activeFolder.id], WORKSPACE_ID)

        expect(result.restoredFolders).toHaveLength(1)
        expect(result.restoredFolders).toContain(deletedFolder.id)
        expect(result.alreadyRestoredFolders).toHaveLength(1)
        expect(result.alreadyRestoredFolders).toContain(activeFolder.id)
        expect(result.notFoundFolders).toBeUndefined()
    })

    it('should handle non-existent folders', async () => {
        const nonExistentId = generateId('-nonexistent')

        const result = await FolderRestoreService.restoreFolders([nonExistentId], WORKSPACE_ID)

        expect(result.restoredFolders).toHaveLength(0)
        expect(result.alreadyRestoredFolders).toBeUndefined()
        expect(result.notFoundFolders).toHaveLength(1)
        expect(result.notFoundFolders).toContain(nonExistentId)
    })

    it('should restore folders with parent relationships', async () => {
        const parentFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-parent'),
                name: 'Parent Folder',
                workspaceId: WORKSPACE_ID
            }
        })

        const childFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-child'),
                name: 'Child Folder',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                parentIdBeforeDeletion: parentFolder.id
            }
        })

        const result = await FolderRestoreService.restoreFolders([childFolder.id], WORKSPACE_ID)

        expect(result.restoredFolders).toHaveLength(1)
        expect(result.restoredFolders).toContain(childFolder.id)

        const restoredFolder = await services.prisma.client.folder.findUnique({ where: { id: childFolder.id } })

        expect(restoredFolder?.deletedAt).toBeNull()
        expect(restoredFolder?.parentId).toBe(parentFolder.id)
        expect(restoredFolder?.parentIdBeforeDeletion).toBeNull()
    })

    it('should handle deleted parent folders when restoring folders', async () => {
        const deletedParentFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-deleted-parent'),
                name: 'Deleted Parent Folder',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date()
            }
        })

        const childFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-child-with-deleted-parent'),
                name: 'Child Folder with Deleted Parent',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                parentIdBeforeDeletion: deletedParentFolder.id
            }
        })

        const result = await FolderRestoreService.restoreFolders([childFolder.id], WORKSPACE_ID)

        expect(result.restoredFolders).toHaveLength(1)
        expect(result.restoredFolders).toContain(childFolder.id)

        const restoredFolder = await services.prisma.client.folder.findUnique({ where: { id: childFolder.id } })

        expect(restoredFolder?.deletedAt).toBeNull()
        expect(restoredFolder?.parentId).toBeNull()
        expect(restoredFolder?.parentIdBeforeDeletion).toBeNull()
    })

    it('should restore nested folders and their files', async () => {
        const parentFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-parent2'),
                name: 'Parent Folder',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date()
            }
        })

        const childFolder = await services.prisma.client.folder.create({
            data: {
                id: generateId('-child2'),
                name: 'Child Folder',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                parentId: parentFolder.id
            }
        })

        const file = await services.prisma.client.file.create({
            data: {
                id: generateId('-file'),
                name: 'Test File',
                workspaceId: WORKSPACE_ID,
                deletedAt: new Date(),
                folderId: childFolder.id,
                size: BigInt(100),
                mimeType: 'text/plain',
                extension: 'txt',
                type: 'document',
                path: `/test/file-${Date.now()}.txt`
            }
        })

        const result = await FolderRestoreService.restoreFolders([parentFolder.id], WORKSPACE_ID)

        expect(result.restoredFolders).toHaveLength(1)
        expect(result.restoredFolders).toContain(parentFolder.id)

        const restoredParentFolder = await services.prisma.client.folder.findUnique({ where: { id: parentFolder.id } })
        const restoredChildFolder = await services.prisma.client.folder.findUnique({ where: { id: childFolder.id } })
        const restoredFile = await services.prisma.client.file.findUnique({ where: { id: file.id } })

        expect(restoredParentFolder?.deletedAt).toBeNull()
        expect(restoredChildFolder?.deletedAt).toBeNull()
        expect(restoredFile?.deletedAt).toBeNull()
        expect(restoredChildFolder?.parentId).toBe(parentFolder.id)
        expect(restoredFile?.folderId).toBe(childFolder.id)
    })
}) 