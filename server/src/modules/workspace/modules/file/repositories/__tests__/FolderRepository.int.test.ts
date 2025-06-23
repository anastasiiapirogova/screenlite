import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { FolderRepository } from '../FolderRepository.js'
import { prisma } from '@/config/prisma.js'

const WORKSPACE_ID = 'workspace-folder-repo'

const generateId = (suffix = '') => `folder-${Date.now()}${suffix}`

describe('FolderRepository tests', () => {
    beforeAll(async () => {
        await prisma.workspace.upsert({
            where: { id: WORKSPACE_ID },
            update: {},
            create: { id: WORKSPACE_ID, name: 'Test Workspace', slug: WORKSPACE_ID, status: 'ACTIVE' },
        })
    })

    beforeEach(async () => {
        await prisma.folder.deleteMany({
            where: {
                workspaceId: WORKSPACE_ID,
            }
        })
    })

    afterAll(async () => {
        await prisma.workspace.delete({
            where: { id: WORKSPACE_ID },
        })
    })

    it('should create a folder and retrieve it by workspace and id', async () => {
        const folderData = {
            id: generateId(),
            name: 'My Test Folder',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }

        const created = await FolderRepository.createFolder(folderData)

        expect(created.id).toBe(folderData.id)
        expect(created.name).toBe('My Test Folder')

        const found = await FolderRepository.findFolder(folderData.id, folderData.workspaceId)

        expect(found).not.toBeNull()
        expect(found?.id).toBe(folderData.id)
    })

    it('should update a folder name', async () => {
        const folderData = {
            id: generateId('-upd'),
            name: 'Old Name',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }

        await FolderRepository.createFolder(folderData)

        const updated = await FolderRepository.updateFolder(folderData.id, { name: 'New Name' })

        expect(updated.name).toBe('New Name')

        const found = await FolderRepository.findFolder(folderData.id, folderData.workspaceId)

        expect(found?.name).toBe('New Name')
    })

    it('should delete a folder', async () => {
        const folderData = {
            id: generateId('-del'),
            name: 'Folder to Delete',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }

        await FolderRepository.createFolder(folderData)

        const deleted = await FolderRepository.deleteFolder(folderData.id)

        expect(deleted.id).toBe(folderData.id)

        const found = await FolderRepository.findFolder(folderData.id, folderData.workspaceId)

        expect(found).toBeNull()
    })

    it('should find folders by IDs with workspace info', async () => {
        const folder1 = {
            id: generateId('-f1'),
            name: 'Folder 1',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }
        const folder2 = {
            id: generateId('-f2'),
            name: 'Folder 2',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }

        await FolderRepository.createFolder(folder1)
        await FolderRepository.createFolder(folder2)

        const folders = await FolderRepository.findFoldersByIdsWithWorkspace([folder1.id, folder2.id])

        expect(folders.length).toBe(2)
        expect(folders.find(f => f.id === folder1.id)?.workspaceId).toBe(WORKSPACE_ID)
    })

    it('should update multiple folders parentId', async () => {
        const newParent = {
            id: generateId('-new-parent'),
            name: 'New Parent Folder',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }

        await FolderRepository.createFolder(newParent)

        const folder1 = {
            id: generateId('-p1'),
            name: 'Folder 1',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }
        const folder2 = {
            id: generateId('-p2'),
            name: 'Folder 2',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }

        await FolderRepository.createFolder(folder1)
        await FolderRepository.createFolder(folder2)

        const updatedFolders = await FolderRepository.updateFoldersParent(
            [folder1.id, folder2.id],
            newParent.id
        )

        expect(updatedFolders.length).toBe(2)
        expect(updatedFolders.every(f => f.parentId === newParent.id)).toBe(true)
    })


    it('should find folder subtree', async () => {
        const parent = {
            id: generateId('-parent'),
            name: 'Parent',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }
        const child1 = {
            id: generateId('-child1'),
            name: 'Child 1',
            workspaceId: WORKSPACE_ID,
            parentId: parent.id,
        }
        const child2 = {
            id: generateId('-child2'),
            name: 'Child 2',
            workspaceId: WORKSPACE_ID,
            parentId: child1.id,
        }

        await FolderRepository.createFolder(parent)
        await FolderRepository.createFolder(child1)
        await FolderRepository.createFolder(child2)

        const subtree = await FolderRepository.findFolderSubtreeById(parent.id)
        const subtreeIds = subtree.map(f => f.id)

        expect(subtreeIds).toContain(child1.id)
        expect(subtreeIds).toContain(child2.id)
        expect(subtreeIds).not.toContain(parent.id)
    })

    it('should find folder ancestors', async () => {
        const grandparent = {
            id: generateId('-grandparent'),
            name: 'Grandparent',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }
        const parent = {
            id: generateId('-parent'),
            name: 'Parent',
            workspaceId: WORKSPACE_ID,
            parentId: grandparent.id,
        }
        const child = {
            id: generateId('-child'),
            name: 'Child',
            workspaceId: WORKSPACE_ID,
            parentId: parent.id,
        }

        await FolderRepository.createFolder(grandparent)
        await FolderRepository.createFolder(parent)
        await FolderRepository.createFolder(child)

        const ancestors = await FolderRepository.findFolderAncestorsById(child.id)
        const ancestorIds = ancestors.map(f => f.id)

        expect(ancestorIds).toContain(grandparent.id)
        expect(ancestorIds).toContain(parent.id)
        expect(ancestorIds).not.toContain(child.id)
    })

    it('should find active folders by IDs', async () => {
        const folder = {
            id: generateId('-active'),
            name: 'Active Folder',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }
        const deletedFolder = {
            id: generateId('-deleted'),
            name: 'Deleted Folder',
            workspaceId: WORKSPACE_ID,
            parentId: null,
            deletedAt: new Date(),
        }

        await FolderRepository.createFolder(folder)
        await FolderRepository.createFolder(deletedFolder)

        const activeFolders = await FolderRepository.findActiveFoldersByIds([folder.id, deletedFolder.id])

        expect(activeFolders.length).toBe(1)
        expect(activeFolders[0].id).toBe(folder.id)
    })

    it('should calculate folder depth', async () => {
        const root = {
            id: generateId('-root'),
            name: 'Root Folder',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }
        const level1 = {
            id: generateId('-l1'),
            name: 'Level 1',
            workspaceId: WORKSPACE_ID,
            parentId: root.id,
        }
        const level2 = {
            id: generateId('-l2'),
            name: 'Level 2',
            workspaceId: WORKSPACE_ID,
            parentId: level1.id,
        }

        await FolderRepository.createFolder(root)
        await FolderRepository.createFolder(level1)
        await FolderRepository.createFolder(level2)

        const depth = await FolderRepository.calculateFolderDepth(root.workspaceId, level2.id)

        expect(depth).toBe(3)

        const rootDepth = await FolderRepository.calculateFolderDepth(root.workspaceId, root.id)

        expect(rootDepth).toBe(1)

        const zeroDepth = await FolderRepository.calculateFolderDepth(root.workspaceId, null)

        expect(zeroDepth).toBe(0)
    })

    it('should find max subfolder depth', async () => {
        const root = {
            id: generateId('-maxroot'),
            name: 'Max Root',
            workspaceId: WORKSPACE_ID,
            parentId: null,
        }
        const child1 = {
            id: generateId('-child1'),
            name: 'Child 1',
            workspaceId: WORKSPACE_ID,
            parentId: root.id,
        }
        const child2 = {
            id: generateId('-child2'),
            name: 'Child 2',
            workspaceId: WORKSPACE_ID,
            parentId: child1.id,
        }

        await FolderRepository.createFolder(root)
        await FolderRepository.createFolder(child1)
        await FolderRepository.createFolder(child2)

        const maxDepth = await FolderRepository.findMaxSubfolderDepth(root.id)

        expect(maxDepth).toBe(2)

        const noSubfoldersDepth = await FolderRepository.findMaxSubfolderDepth(child2.id)

        expect(noSubfoldersDepth).toBe(0)
    })

    it('should find all unique subfolder ids for given root ids', async () => {
        const root1 = generateId('root1')
        const child1 = generateId('child1')
        const child2 = generateId('child2')
        const subchild1 = generateId('subchild1')
        const root2 = generateId('root2')
        const child3 = generateId('child3')

        await prisma.folder.createMany({
            data: [
                { id: root1, name: 'Root 1', workspaceId: WORKSPACE_ID, parentId: null },
                { id: child1, name: 'Child 1', workspaceId: WORKSPACE_ID, parentId: root1 },
                { id: child2, name: 'Child 2', workspaceId: WORKSPACE_ID, parentId: root1 },
                { id: subchild1, name: 'Subchild 1', workspaceId: WORKSPACE_ID, parentId: child1 },
                { id: root2, name: 'Root 2', workspaceId: WORKSPACE_ID, parentId: null },
                { id: child3, name: 'Child 3', workspaceId: WORKSPACE_ID, parentId: root2 },
            ],
        })

        const result = await FolderRepository.findUniqueSubfolderIdsByRootIds([root1, root2])
        const resultIds = result.map(r => r.id)

        expect(resultIds).toHaveLength(4)
        expect(resultIds).toEqual(expect.arrayContaining([
            child1, child2, subchild1, child3
        ]))
        expect(resultIds).not.toContain(root1)
        expect(resultIds).not.toContain(root2)
    })

    it('should return empty array if there are no subfolders', async () => {
        const lonelyRoot = generateId('lonely-root')

        await prisma.folder.create({
            data: {
                id: lonelyRoot,
                name: 'Lonely Root',
                workspaceId: WORKSPACE_ID,
                parentId: null,
            }
        })

        const result = await FolderRepository.findUniqueSubfolderIdsByRootIds([lonelyRoot])

        expect(result).toEqual([])
    })

    it('should return empty array when given empty input', async () => {
        const result = await FolderRepository.findUniqueSubfolderIdsByRootIds([])

        expect(result).toEqual([])
    })

})
