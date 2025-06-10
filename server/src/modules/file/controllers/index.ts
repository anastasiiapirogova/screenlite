import { createFileUploadSession } from '@modules/file/controllers/createFileUploadSession.js'
import { uploadFilePart } from '@modules/file/controllers/uploadFilePart.js'
import { cancelFileUploading } from '@modules/file/controllers/cancelFileUploading.js'
import { getWorkspaceFiles } from '@modules/file/controllers/getWorkspaceFiles.js'
import { createFolder } from '@modules/file/controllers/createFolder.js'
import { getFolder } from '@modules/file/controllers/getFolder.js'
import { getWorkspaceFolders } from '@modules/file/controllers/getWorkspaceFolders.js'
import { softDeleteFolders } from '@modules/file/controllers/softDeleteFolders.js'
import { softDeleteFiles } from '@modules/file/controllers/softDeleteFiles.js'
import { moveFiles } from '@modules/file/controllers/moveFiles.js'
import { moveFolders } from '@modules/file/controllers/moveFolders.js'
import { updateFolder } from '@modules/file/controllers/updateFolder.js'

export {
    createFileUploadSession,
    uploadFilePart,
    cancelFileUploading,
    getWorkspaceFiles,
    createFolder,
    getFolder,
    getWorkspaceFolders,
    softDeleteFolders,
    softDeleteFiles,
    moveFiles,
    moveFolders,
    updateFolder
}

export default {
    createFileUploadSession,
    uploadFilePart,
    cancelFileUploading,
    getWorkspaceFiles,
    createFolder,
    getFolder,
    getWorkspaceFolders,
    softDeleteFolders,
    softDeleteFiles,
    moveFiles,
    moveFolders,
    updateFolder
}