import { Request, Response } from 'express'
import { moveToFolderSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { FileRepository } from '../repositories/FileRepository.js'

type MovableFile = {
    id: string
    workspaceId: string
    deletedAt: Date | null
}

type MovableFolder = {
    id: string
    workspaceId: string
    deletedAt: Date | null
}

const getSharedWorkspaceId = (files: MovableFile[], folders: MovableFolder[], folderWorkspaceId?: string): string | null => {
    const fileWorkspaceIds = files.map(file => file.workspaceId)
    const folderWorkspaceIds = folders.map(folder => folder.workspaceId)
    const allWorkspaceIds = [...fileWorkspaceIds, ...folderWorkspaceIds]
    const uniqueWorkspaceIds = Array.from(new Set(allWorkspaceIds))

    if (uniqueWorkspaceIds.length === 1 && (!folderWorkspaceId || uniqueWorkspaceIds.includes(folderWorkspaceId))) {
        return uniqueWorkspaceIds[0]
    }

    return null
}

const canMoveFoldersToTarget = async (folderIds?: string[], targetFolderId?: string | null) => {
    if (!targetFolderId || !folderIds) return true

    const parentFolderTree = await FolderRepository.getAllParentFolders(targetFolderId)
    const parentFolderIds = parentFolderTree.map(folder => folder.id)

    const isAnyFolderParentOfTarget = folderIds.some(folderId => parentFolderIds.includes(folderId))

    return !isAnyFolderParentOfTarget
}

const moveEntitiesToRoot = async (req: Request, res: Response, files?: MovableFile[], folders?: MovableFolder[]) => {
    if (!files && !folders) {
        return ResponseHandler.json(res, {
            files: [],
            folders: [],
        })
    }

    const fileIds = files?.map(file => file.id)
    const folderIds = folders?.map(folder => folder.id)

    const updatedFiles = await FileRepository.updateFilesFolderId(fileIds || [], null)
    const updatedFolders = await FolderRepository.updateFoldersParentId(folderIds || [], null)

    return ResponseHandler.json(res, {
        files: updatedFiles,
        folders: updatedFolders,
    })
}

const moveEntitiesToFolder = async (req: Request, res: Response, targetFolderId: string, files?: MovableFile[], folders?: MovableFolder[]) => {
    if (!files && !folders) {
        return ResponseHandler.json(res, {
            files: [],
            folders: [],
        })
    }

    const targetFolder = await FolderRepository.getFolderById(targetFolderId)

    if(!targetFolder) {
        return ResponseHandler.validationError(req, res, {
            folderId: 'FOLDER_NOT_FOUND',
        })
    }

    if(targetFolder.deletedAt !== null) {
        return ResponseHandler.validationError(req, res, {
            folderId: 'CANNOT_MOVE_FILES_TO_DELETED_FOLDER',
        })
    }

    const fileIds = files?.map(file => file.id)
    const folderIds = folders?.map(folder => folder.id)

    const canMoveFoldersToTargetFolder = await canMoveFoldersToTarget(folderIds, targetFolder.workspaceId)

    if (!canMoveFoldersToTargetFolder) {
        return ResponseHandler.validationError(req, res, {
            folderIds: 'CANNOT_MOVE_FOLDERS_TO_ITS_OWN_SUBTREE',
        })
    }

    const updatedFiles = fileIds ? await FileRepository.updateFilesFolderId(fileIds || [], null) : []
    const updatedFolders = folderIds ? await FolderRepository.updateFoldersParentId(folderIds || [], null) : []

    return ResponseHandler.json(res, {
        files: updatedFiles,
        folders: updatedFolders,
    })
}

const validateFiles = async (files?: MovableFile[]) => {
    if (!files) return null

    const someFilesDeleted = files.some(file => file.deletedAt !== null)

    if (someFilesDeleted) {
        return {
            fileIds: 'CANNOT_MOVE_DELETED_FILES',
        }
    }

    return null
}

const validateFolders = async (folders?: MovableFolder[]) => {
    if (!folders) return null

    const someFoldersDeleted = folders.some(folder => folder.deletedAt !== null)

    if (someFoldersDeleted) {
        return {
            folderIds: 'CANNOT_MOVE_DELETED_FOLDERS',
        }
    }

    return null
}

export const moveToFolder = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await moveToFolderSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { fileIds, folderIds, folderId, workspaceId } = validation.data

    const allowed = await filePolicy.canMoveFiles(user, workspaceId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const files = await FileRepository.getFilesForFolderMove(fileIds)
    const folders = await FolderRepository.getFoldersForFolderMove(folderIds)
    const sharedWorkspaceId = getSharedWorkspaceId(files, folders, workspaceId)

    if (sharedWorkspaceId !== workspaceId) {
        return ResponseHandler.validationError(req, res, {
            workspaceId: 'ENTITIES_BELONG_TO_DIFFERENT_WORKSPACE',
        })
    }

    const filesValidationError = await validateFiles(files)

    if (filesValidationError) {
        return ResponseHandler.validationError(req, res, filesValidationError)
    }

    const foldersValidationError = await validateFolders(folders)

    if (foldersValidationError) {
        return ResponseHandler.validationError(req, res, foldersValidationError)
    }

    if(folderId) {
        await moveEntitiesToFolder(req, res, folderId, files, folders)
    } else {
        await moveEntitiesToRoot(req, res, files, folders)
    }
}